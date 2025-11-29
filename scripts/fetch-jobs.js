// scripts/fetch-jobs.js
// Final robust aggregator — HTTP/HTTPS handling, UA rotation, HTML fallback, dedupe, SEO titles.
// Node.js v18+ (package.json should have "type":"module")

import fs from "fs";
import path from "path";
import Parser from "rss-parser";
import fetch from "node-fetch";
import * as cheerio from "cheerio";
import https from "https";
import crypto from "crypto";

// CONFIG
const APPSCRIPT_POST_URL = process.env.APPSCRIPT_POST_URL || "https://script.google.com/macros/s/AKfycbxpuquuUqABxTSPpXs9pM2kn9Y14RQoJ26i_i3Z9MjFc-kwDZv9l5JHy5AW5fupBAZy/exec";
const RETRY_COUNT = 3;
const RETRY_DELAY_MS = 900;
const REQUEST_TIMEOUT_MS = 20000;
const MAX_ITEMS_PER_FEED = 25;
const DATA_DIR = path.resolve("./data");
const SEEN_FILE = path.join(DATA_DIR, "seen.json");
const LOGS_DIR = path.resolve("./logs");
const FEEDS_PATH = path.resolve("./scripts/feeds.json");

if (!APPSCRIPT_POST_URL || !APPSCRIPT_POST_URL.startsWith("https://")) {
  console.error("APPSCRIPT_POST_URL missing or invalid. Set env var APPSCRIPT_POST_URL or edit script.");
  process.exit(1);
}

if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR, { recursive: true });
if (!fs.existsSync(LOGS_DIR)) fs.mkdirSync(LOGS_DIR, { recursive: true });

const parser = new Parser({ timeout: REQUEST_TIMEOUT_MS });

// small set of realistic user-agents to rotate when 403 occurs
const USER_AGENTS = [
  "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120 Safari/537.36",
  "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/16 Safari/605.1.15",
  "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/115 Safari/537.36"
];

const httpsAgent = new https.Agent({ rejectUnauthorized: true });

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
  const suffixes = ["Latest Jobs in India", "Apply Now", "Hiring Now", "New Opening"];
  const s = suffixes[Math.floor(Math.random()*suffixes.length)];
  const base = (title || "Job Opening").trim();
  let t = `${base} | ${s} | ${source} | India`;
  if (t.length > 120) t = `${base.slice(0,90)}... | ${s} | India`;
  return t;
}

async function fetchTextWithRetry(url, options = {}, tryAlternateUAs = true) {
  let lastErr = null;
  for (let attempt=1; attempt<=RETRY_COUNT; attempt++) {
    try {
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);
      // pass httpsAgent only for https URLs to avoid protocol error
      const agent = url.startsWith("https://") ? httpsAgent : undefined;
      const res = await fetch(url, { ...options, signal: controller.signal, agent });
      clearTimeout(timeout);
      if (!res.ok) {
        const body = await res.text().catch(()=>"");
        throw new Error(`HTTP ${res.status} ${res.statusText} - ${body.slice(0,150)}`);
      }
      const txt = await res.text();
      return txt;
    } catch (err) {
      lastErr = err;
      // if 403 and tryAlternateUAs true, switch UA and retry immediately with different headers
      const is403 = (err.message && err.message.includes("HTTP 403"));
      if (is403 && tryAlternateUAs) {
        for (const ua of USER_AGENTS) {
          try {
            const controller = new AbortController();
            const timeout = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);
            const headers = { "User-Agent": ua, "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8" };
            const agent = url.startsWith("https://") ? httpsAgent : undefined;
            const res2 = await fetch(url, { headers, signal: controller.signal, agent });
            clearTimeout(timeout);
            if (!res2.ok) {
              const body2 = await res2.text().catch(()=>"");
              throw new Error(`HTTP ${res2.status} ${res2.statusText} - ${body2.slice(0,150)}`);
            }
            return await res2.text();
          } catch (eua) {
            lastErr = eua;
            // try next UA
          }
        }
      }
      console.warn(`Retry ${attempt}/${RETRY_COUNT} for ${url}: ${err.message || err}`);
      await wait(RETRY_DELAY_MS * attempt);
    }
  }
  throw lastErr;
}

async function parseFeedOrHtml(xml, sourceLabel) {
  // try rss parser first
  try {
    return await parser.parseString(xml);
  } catch (e) {
    // fallback to HTML scanning for job-like anchors
    const $ = cheerio.load(xml);
    const items = [];
    $("a[href]").each((i, el) => {
      const href = $(el).attr("href");
      const text = $(el).text().trim();
      if (!href) return;
      const low = (href + " " + text).toLowerCase();
      if (low.includes("job") || low.includes("career") || low.includes("vacanc") || low.includes("apply") || low.includes("recruit")) {
        // resolve relative
        let link = href;
        try { link = new URL(href, "https://example.com").toString(); } catch {}
        items.push({ title: text || href, link });
      }
    });
    if (items.length) return { items };
    throw new Error("Not RSS and no HTML candidates found");
  }
}

async function tryFetchAndParse(url, sourceLabel, fallbackUrls = []) {
  const headers = { "User-Agent": USER_AGENTS[0], "Accept": "application/rss+xml, application/xml, text/xml, text/html;q=0.9" };
  try {
    const xml = await fetchTextWithRetry(url, { headers });
    return await parseFeedOrHtml(xml, sourceLabel);
  } catch (err) {
    // try fallbackUrls (if any) and http fallback if https failed
    const tries = [ ...fallbackUrls ];
    if (url.startsWith("https://")) tries.unshift(url.replace("https://", "http://"));
    for (const u of tries) {
      try {
        const xml2 = await fetchTextWithRetry(u, { headers });
        return await parseFeedOrHtml(xml2, sourceLabel);
      } catch (e) {
        // try alternate UAs on 403 inside fetchTextWithRetry
      }
    }
    throw err;
  }
}

async function postToAppsScript(job) {
  try {
    const res = await fetch(APPSCRIPT_POST_URL, { method: "POST", headers: { "Content-Type":"application/json" }, body: JSON.stringify(job) });
    const text = await res.text().catch(()=>"");
    return { ok: res.ok, status: res.status, text };
  } catch (err) {
    throw err;
  }
}

function normalizeUrl(u) {
  if (!u) return "";
  try { return new URL(u).toString(); } catch {
    try { return new URL("https://"+u).toString(); } catch { return u; }
  }
}

async function main() {
  console.log("Aggregator starting...");
  if (!fs.existsSync(FEEDS_PATH)) { console.error("feeds.json not found:", FEEDS_PATH); process.exit(1); }
  const feeds = JSON.parse(fs.readFileSync(FEEDS_PATH, "utf8"));
  const seen = loadSeen();
  let posted = 0;
  const runDetails = [];

  for (const f of feeds) {
    // skip disabled feeds
    if (f.enabled === false) {
      console.log(`Skipping disabled feed: ${f.source}`);
      continue;
    }
    console.log(`\nFetching ${f.source} -> ${f.url}`);
    let feedObj = null;
    try {
      feedObj = await tryFetchAndParse(f.url, f.source, f.fallbackUrls || []);
      console.log(`  Found items: ${feedObj.items?.length || 0}`);
    } catch (err) {
      console.warn(`  ERROR fetching ${f.source}: ${err.message || err}`);
      runDetails.push({ source: f.source, url: f.url, ok:false, reason: err.message || String(err) });
      continue;
    }

    const items = (feedObj.items || []).slice(0, MAX_ITEMS_PER_FEED);
    let postedFromSource = 0;

    for (const item of items) {
      const link = normalizeUrl(item.link || item.guid || item.enclosure?.url || "");
      const rawTitle = (item.title || item.name || "").trim();
      const id = hash((link || rawTitle).toLowerCase());
      if (!link && !rawTitle) continue;
      if (seen[id]) continue;

      // India-focus: we still accept all, but we add India tag in title for SEO
      const title = seoTitle(rawTitle || f.source, f.source);
      const job = {
        title,
        rawTitle,
        company: (item.creator || item.author || item.company || "").trim(),
        location: item.categories ? (Array.isArray(item.categories) ? item.categories.join(", ") : item.categories) : (item.location || ""),
        source: f.source,
        link,
        description: ((item.contentSnippet || item.content || item.summary || "") + "").replace(/<\/?[^>]+(>|$)/g, "").slice(0,1500),
        datePosted: item.pubDate || item.isoDate || new Date().toISOString(),
      };

      // POST
      try {
        const res = await postToAppsScript(job);
        if (res.ok) {
          console.log(`  Posted: ${title.slice(0,80)} -> ${res.status}`);
          seen[id] = { when: new Date().toISOString(), source: f.source, link };
          saveSeen(seen);
          posted++;
          postedFromSource++;
        } else {
          console.warn(`  Post failed ${res.status} ${res.text ? res.text.slice(0,120) : ""}`);
        }
      } catch (pe) {
        console.error(`  POST error: ${pe.message || pe}`);
      }

      await wait(200 + Math.floor(Math.random()*600));
    }

    runDetails.push({ source: f.source, url: f.url, items: items.length, posted: postedFromSource });
  }

  const logFile = path.join(LOGS_DIR, `run-${new Date().toISOString().replace(/[:.]/g,"-")}.json`);
  fs.writeFileSync(logFile, JSON.stringify({ runAt: new Date().toISOString(), posted, details: runDetails }, null, 2), "utf8");
  console.log(`\nDone. Posted this run: ${posted}. Log: ${logFile}`);
}

main().catch(e => { console.error("Fatal:", e && e.stack ? e.stack : e); process.exit(1); });
