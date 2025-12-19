// scripts/fetch-jobs.js
// Node 18+ SAFE RSS → Google Apps Script Fetcher

import fs from "fs";
import path from "path";
import Parser from "rss-parser";
import * as cheerio from "cheerio";
import crypto from "crypto";

// ✅ Native fetch (NO node-fetch, NO undici crash)
const fetch = global.fetch;

// ================= CONFIG =================

const APPSCRIPT_POST_URL =
  "https://script.google.com/macros/s/AKfycbxAEvno-qjnPs8rrEH2DITQ0pqA90LsbcQlaGuBKEtrZVvuVaeno5OYULqNRfi_mR6T/exec";

const RETRY_COUNT = 3;
const RETRY_DELAY_MS = 1000;
const REQUEST_TIMEOUT_MS = 20000;
const MAX_ITEMS_PER_FEED = 25;

const DATA_DIR = path.resolve("./data");
const SEEN_FILE = path.join(DATA_DIR, "seen.json");
const FEEDS_PATH = path.resolve("./scripts/feeds.json");

// =========================================

if (!APPSCRIPT_POST_URL.startsWith("https://")) {
  console.error("Invalid Apps Script URL");
  process.exit(1);
}

if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR, { recursive: true });

const parser = new Parser({ timeout: REQUEST_TIMEOUT_MS });

const wait = ms => new Promise(r => setTimeout(r, ms));
const hash = s => crypto.createHash("sha256").update(s || "").digest("hex");

// ================= HELPERS =================

function loadSeen() {
  try {
    if (!fs.existsSync(SEEN_FILE)) return {};
    return JSON.parse(fs.readFileSync(SEEN_FILE, "utf8"));
  } catch {
    return {};
  }
}

function saveSeen(obj) {
  fs.writeFileSync(SEEN_FILE, JSON.stringify(obj, null, 2), "utf8");
}

async function fetchWithRetry(url) {
  let lastErr;
  for (let i = 1; i <= RETRY_COUNT; i++) {
    try {
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);

      const res = await fetch(url, {
        headers: { "User-Agent": "Mozilla/5.0" },
        signal: controller.signal
      });

      clearTimeout(timeout);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      return await res.text();
    } catch (err) {
      lastErr = err;
      await wait(RETRY_DELAY_MS * i);
    }
  }
  throw lastErr;
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
      if (href && /(job|career|vacanc|apply)/i.test(href + text)) {
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
  console.log("Fetch Jobs started");

  const feeds = JSON.parse(fs.readFileSync(FEEDS_PATH, "utf8"));
  const seen = loadSeen();

  for (const f of feeds) {
    let feed;
    try {
      const xml = await fetchWithRetry(f.url);
      feed = await parseFeedOrHtml(xml);
    } catch {
      continue;
    }

    for (const item of (feed.items || []).slice(0, MAX_ITEMS_PER_FEED)) {
      const link = item.link || "";
      const id = hash(link || item.title);
      if (!link || seen[id]) continue;

      const job = {
        title: item.title,
        source: f.source,
        link,
        datePosted: new Date().toISOString()
      };

      if (await postToAppsScript(job)) {
        seen[id] = true;
        saveSeen(seen);
      }
    }
  }

  console.log("Fetch Jobs completed");
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});