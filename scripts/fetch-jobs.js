// scripts/fetch-jobs.js
import fs from "fs";
import path from "path";
import Parser from "rss-parser";
import crypto from "crypto";
import fetch from "node-fetch"; // ✅ Ensure node-fetch import

// ✅ Naya Apps Script Web App URL
const APPSCRIPT_POST_URL =
  "https://script.google.com/macros/s/AKfycbyJFzC1seakm3y5BK8d-W7OPSLI1KqE1hXeeVqR_IaCuvbNDsexy8Ey4SY3k-DAL2ta/exec";

const FEEDS_PATH = path.resolve("./scripts/feeds.json");
const DATA_DIR = path.resolve("./data");
const SEEN_FILE = path.join(DATA_DIR, "seen.json");

if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR, { recursive: true });

const parser = new Parser();
const wait = ms => new Promise(r => setTimeout(r, ms));
const hash = s => crypto.createHash("sha256").update(s || "").digest("hex");

function loadSeen() {
  try {
    return JSON.parse(fs.readFileSync(SEEN_FILE, "utf8"));
  } catch {
    return {};
  }
}

function saveSeen(data) {
  fs.writeFileSync(SEEN_FILE, JSON.stringify(data, null, 2));
}

async function main() {
  console.log("🚀 Fetch started");

  const feeds = JSON.parse(fs.readFileSync(FEEDS_PATH, "utf8"));
  const seen = loadSeen();

  for (const f of feeds) {
    try {
      const res = await fetch(f.url);
      const xml = await res.text();
      const feed = await parser.parseString(xml);

      for (const item of feed.items.slice(0, 20)) {
        const link = item.link || "";
        const id = hash(link);

        if (!link || seen[id]) continue;

        const job = {
          title: item.title,
          source: f.source,
          link,
          datePosted: item.pubDate || new Date().toISOString()
        };

        const post = await fetch(APPSCRIPT_POST_URL, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(job)
        });

        if (post.ok) {
          seen[id] = true;
          saveSeen(seen);
        }

        await wait(300);
      }
    } catch (err) {
      console.log("⚠️ Feed error:", f.source, err.message);
    }
  }

  console.log("✅ Fetch completed");
}

main().catch(err => {
  console.error("❌ Fatal error:", err);
  process.exit(1);
});