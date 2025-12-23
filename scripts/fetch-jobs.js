// scripts/fetch-jobs.js
import fs from "fs";
import path from "path";
import Parser from "rss-parser";
import crypto from "crypto";
import { fileURLToPath } from "url";

// ✅ Node 18+ / 20 me fetch built-in hota hai
// ❌ node-fetch import HATA DIYA

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// ✅ Apps Script Web App URL
const APPSCRIPT_POST_URL =
  "https://script.google.com/macros/s/AKfycbyJFzC1seakm3y5BK8d-W7OPSLI1KqE1hXeeVqR_IaCuvbNDsexy8Ey4SY3k-DAL2ta/exec";

const FEEDS_PATH = path.join(__dirname, "feeds.json");
const DATA_DIR = path.join(__dirname, "../data");
const SEEN_FILE = path.join(DATA_DIR, "seen.json");

if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

const parser = new Parser();
const wait = (ms) => new Promise((r) => setTimeout(r, ms));
const hash = (s) =>
  crypto.createHash("sha256").update(s || "").digest("hex");

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
      console.log(`🔎 Reading feed: ${f.source}`);

      const res = await fetch(f.url);
      const xml = await res.text();
      const feed = await parser.parseString(xml);

      for (const item of feed.items.slice(0, 20)) {
        const link = item.link || "";
        const id = hash(link);

        if (!link || seen[id]) continue;

        const job = {
          title: item.title || "",
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
          console.log("✅ Posted:", job.title);
        }

        await wait(300);
      }
    } catch (err) {
      console.log("⚠️ Feed error:", f.source, err.message);
    }
  }

  console.log("✅ Fetch completed");
}

main().catch((err) => {
  console.error("❌ Fatal error:", err);
  process.exit(1);
});