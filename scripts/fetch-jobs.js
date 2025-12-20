// scripts/fetch-jobs.js
// FINAL FIX — Node 18 native fetch (NO node-fetch)

import fs from "fs";
import path from "path";
import Parser from "rss-parser";
import * as cheerio from "cheerio";
import crypto from "crypto";

// ================= CONFIG =================

const APPSCRIPT_POST_URL =
  "https://script.google.com/macros/s/AKfycbxAEvno-qjnPs8rrEH2DITQ0pqA90LsbcQlaGuBKEtrZVvuVaeno5OYULqNRfi_mR6T/exec";

const MAX_ITEMS_PER_FEED = 25;
const REQUEST_TIMEOUT_MS = 20000;

const DATA_DIR = path.resolve("./data");
const SEEN_FILE = path.join(DATA_DIR, "seen.json");
const FEEDS_PATH = path.resolve("./scripts/feeds.json");

// ==========================================

if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR, { recursive: true });

const parser = new Parser({ timeout: REQUEST_TIMEOUT_MS });
const wait = ms => new Promise(r => setTimeout(r, ms));
const hash = s => crypto.createHash("sha256").update(s || "").digest("hex");

function loadSeen() {
  try {
    return fs.existsSync(SEEN_FILE)
      ? JSON.parse(fs.readFileSync(SEEN_FILE, "utf8"))
      : {};
  } catch {
    return {};
  }
}

function saveSeen(obj) {
  fs.writeFileSync(SEEN_FILE, JSON.stringify(obj, null, 2), "utf8");
}

async function fetchText(url) {
  const controller = new AbortController();
  setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);

  const res = await fetch(url, {
    headers: { "User-Agent": "Mozilla/5.0" },
    signal: controller.signal
  });

  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  return res.text();
}

async function parseFeedOrHtml(xml) {
  try {
    return await parser.parseString(xml);
  } catch {
    const $ = cheerio.load(xml);
    const items = [];

    $("a[href]").each((_, el) => {
      const href = $(el).attr("href");
      const text = $(el).text().trim();
      if (/(job|career|vacanc|apply)/i.test(href + text)) {
        items.push({ title: text || href, link: href });
      }
    });

    return { items };
  }
}

async function postToAppsScript(job) {
  const res = await fetch(APPSCRIPT_POST_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(job)
  });
  return res.ok;
}

// ================= MAIN =================

async function main() {
  console.log("🚀 Fetch jobs started");

  const feeds = JSON.parse(fs.readFileSync(FEEDS_PATH, "utf8"));
  const seen = loadSeen();
  let posted = 0;

  for (const f of feeds) {
    let feed;
    try {
      const xml = await fetchText(f.url);
      feed = await parseFeedOrHtml(xml);
    } catch (e) {
      console.log("❌ Feed failed:", f.source);
      continue;
    }

    for (const item of feed.items.slice(0, MAX_ITEMS_PER_FEED)) {
      const id = hash(item.link || item.title);
      if (!item.link || seen[id]) continue;

      const job = {
        title: item.title,
        source: f.source,
        link: item.link,
        datePosted: new Date().toISOString()
      };

      if (await postToAppsScript(job)) {
        seen[id] = true;
        saveSeen(seen);
        posted++;
      }

      await wait(300);
    }
  }

  console.log(`✅ Jobs posted: ${posted}`);
}

main().catch(err => {
  console.error("❌ Fatal error:", err);
  process.exit(1);
});