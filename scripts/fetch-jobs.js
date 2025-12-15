// scripts/fetch-jobs.js
// Final robust aggregator — HTTP/HTTPS handling, UA rotation, HTML fallback, dedupe, SEO titles.
// Node.js v18+ (package.json should have "type":"module")

import fs from "fs";
import path from "path";
import Parser from "rss-parser";
import * as cheerio from "cheerio";
import crypto from "crypto";

// CONFIG
const APPSCRIPT_POST_URL =
  process.env.APPSCRIPT_POST_URL ||
  "https://script.google.com/macros/s/AKfycbxpuquuUqABxTSPpXs9pM2kn9Y14RQoJ26i_i3Z9MjFc-kwDZv9l5JHy5AW5fupBAZy/exec";

const RETRY_COUNT = 3;
const RETRY_DELAY_MS = 900;
const REQUEST_TIMEOUT_MS = 20000;
const MAX_ITEMS_PER_FEED = 25;

const DATA_DIR = path.resolve("./data");
const SEEN_FILE = path.join(DATA_DIR, "seen.json");
const LOGS_DIR = path.resolve("./logs");
const FEEDS_PATH = path.resolve("./scripts/feeds.json");

if (!APPSCRIPT_POST_URL || !APPSCRIPT_POST_URL.startsWith("https://")) {
  console.error("APPSCRIPT_POST_URL missing or invalid.");
  process.exit(1);
}

if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR, { recursive: true });
if (!fs.existsSync(LOGS_DIR)) fs.mkdirSync(LOGS_DIR, { recursive: true });

const parser = new Parser({ timeout: REQUEST_TIMEOUT_MS });

const USER_AGENTS = [
  "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120 Safari/537.36",
  "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/16 Safari/605.1.15",
  "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/115 Safari/537.36"
];

const wait = ms => new Promise(r => setTimeout(r, ms));
const hash = s => crypto.createHash("sha256").update(s || "").digest("hex");

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

function seoTitle(title, source) {
  const suffixes = [
    "Latest Jobs in India",
    "Apply Now",
    "Hiring Now",
    "New Opening"
  ];
  const s = suffixes[Math.floor(Math.random() * suffixes.length)];
  const base = (title || "Job Opening").trim();
  let t = `${base} | ${s} | ${source} | India`;
  if (t.length > 120) t = `${base.slice(0, 90)}... | ${s} | India`;
  return t;
}

/**
 * 🔧 FIXED FOR NODE 18
 * - removed https.Agent usage
 * - removed "agent" option from fetch
 */
async function fetchTextWithRetry(url, options = {}, tryAlternateUAs = true) {
  let lastErr = null;

  for (let attempt = 1; attempt <= RETRY_COUNT; attempt++) {
    try {
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);

      const res = await fetch(url, {
        ...options,
        signal: controller.signal
      });

      clearTimeout(timeout);

      if (!res.ok) {
        const body = await res.text().catch(() => "");
        throw new Error(`HTTP ${res.status} ${res.statusText} - ${body.slice(0, 150)}`);
      }

      return await res.text();

    } catch (err) {
      lastErr = err;
      const is403 = err.message?.includes("403");

      if (is403 && tryAlternateUAs) {
        for (const ua of USER_AGENTS) {
          try {
            const controller = new AbortController();
            const timeout = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);

            const r = await fetch(url, {
              headers: { "User-Agent": ua },
              signal: controller.signal
            });

            clearTimeout(timeout);

            if (!r.ok) throw new Error(`HTTP ${r.status}`);
            return await r.text();
          } catch {}
        }
      }

      await wait(RETRY_DELAY_MS * attempt);
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
      if (!href) return;

      const low = (href + text).toLowerCase();
      if (/(job|career|vacanc|apply|recruit)/.test(low)) {
        let link = href;
        try {
          link = new URL(href, "https://example.com").toString();
        } catch {}
        items.push({ title: text || href, link });
      }
    });

    if (items.length) return { items };
    throw new Error("No RSS or HTML jobs found");
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

function normalizeUrl(u) {
  try {
    return new URL(u).toString();
  } catch {
    try {
      return new URL("https://" + u).toString();
    } catch {
      return u || "";
    }
  }
}

async function main() {
  console.log("Aggregator starting...");

  const feeds = JSON.parse(fs.readFileSync(FEEDS_PATH, "utf8"));
  const seen = loadSeen();
  let posted = 0;

  for (const f of feeds) {
    if (f.enabled === false) continue;

    let feed;
    try {
      const xml = await fetchTextWithRetry(f.url);
      feed = await parseFeedOrHtml(xml);
    } catch {
      continue;
    }

    for (const item of (feed.items || []).slice(0, MAX_ITEMS_PER_FEED)) {
      const link = normalizeUrl(item.link || "");
      const id = hash(link || item.title);

      if (seen[id]) continue;

      const job = {
        title: seoTitle(item.title, f.source),
        rawTitle: item.title,
        source: f.source,
        link,
        datePosted: item.pubDate || new Date().toISOString()
      };

      if (await postToAppsScript(job)) {
        seen[id] = true;
        saveSeen(seen);
        posted++;
      }

      await wait(300);
    }
  }

  console.log("Done. Posted:", posted);
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});