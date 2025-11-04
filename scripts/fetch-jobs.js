// scripts/fetch_jobs.js
import Parser from "rss-parser";
import fs from "fs";
import path from "path";
import fetch from "node-fetch";
import https from "https";

const parser = new Parser({ timeout: 20000 });

// PATHS
const feedsPath = path.resolve("./scripts/feeds.json");

// Edit this to your Apps Script URL if you want hardcoded, otherwise you can use env var:
const APPSCRIPT_POST_URL =
  process.env.APPSCRIPT_POST_URL ||
  "https://script.google.com/macros/s/AKfycbxpuquuUqABxTSPpXs9pM2kn9Y14RQoJ26i_i3Z9MjFc-kwDZv9l5JHy5AW5fupBAZy/exec";

// Simple helper: wait
const wait = (ms) => new Promise((r) => setTimeout(r, ms));

// fetch with retries, headers and TLS fallback agent for dev
async function fetchWithRetries(url, opts = {}, retries = 2, timeoutMs = 15000) {
  const headers = {
    "User-Agent":
      "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/117 Safari/537.36",
    Accept: "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
    ...(opts.headers || {}),
  };

  // normal fetch attempt(s)
  for (let i = 0; i <= retries; i++) {
    try {
      const controller = new AbortController();
      const id = setTimeout(() => controller.abort(), timeoutMs);

      const res = await fetch(url, {
        method: opts.method || "GET",
        headers,
        signal: controller.signal,
        // don't follow more than a few redirects:
        redirect: "follow",
      });

      clearTimeout(id);
      return res;
    } catch (err) {
      // last attempt will try a relaxed TLS agent (for dev only)
      if (i === retries) {
        // Try again with an insecure agent (development fallback)
        try {
          const controller = new AbortController();
          const id = setTimeout(() => controller.abort(), timeoutMs);

          const res = await fetch(url, {
            method: opts.method || "GET",
            headers,
            signal: controller.signal,
            redirect: "follow",
            // WARNING: this bypasses TLS certificate validation — only for dev local troubleshooting.
            agent: new https.Agent({ rejectUnauthorized: false }),
          });
          clearTimeout(id);
          return res;
        } catch (err2) {
          throw err2;
        }
      } else {
        // short wait before retry
        await wait(500 + i * 200);
      }
    }
  }
  throw new Error("unreachable");
}

// parse feed robustly: try parser.parseURL (rss-parser) OR fetch + parseString fallback
async function getFeedItems(url) {
  // first try parseURL (rss-parser internal)
  try {
    const feed = await parser.parseURL(url);
    return { items: feed.items || [], title: feed.title || url };
  } catch (e1) {
    // fallback: fetch raw and try parseString
    try {
      const res = await fetchWithRetries(url, {}, 1, 15000);
      if (!res || !res.ok) {
        const status = res ? res.status : "NO_RESPONSE";
        throw new Error(`HTTP ${status}`);
      }
      const text = await res.text();
      // try parseString
      const feed = await parser.parseString(text);
      return { items: feed.items || [], title: feed.title || url };
    } catch (e2) {
      // bubble up helpful message
      throw new Error(e2.message || e1.message || "failed to fetch/parse");
    }
  }
}

async function postToAppScript(job) {
  try {
    const res = await fetch(APPSCRIPT_POST_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(job),
    });
    // try read text (apps script might return plain text)
    const txt = await res.text();
    return { ok: res.ok, status: res.status, body: txt };
  } catch (e) {
    throw e;
  }
}

(async () => {
  if (!fs.existsSync(feedsPath)) {
    console.error("feeds.json not found at", feedsPath);
    process.exit(1);
  }
  if (!APPSCRIPT_POST_URL) {
    console.error("APPSCRIPT_POST_URL not set. Set env or update script.");
    process.exit(1);
  }

  const feedsRaw = fs.readFileSync(feedsPath, "utf-8");
  let feeds = [];
  try {
    feeds = JSON.parse(feedsRaw);
  } catch (e) {
    console.error("Invalid feeds.json:", e.message);
    process.exit(1);
  }

  console.log("Aggregator started — feeds:", feeds.length);

  for (const f of feeds) {
    console.log("\n➡️ Fetching:", f.source, "|", f.url);
    try {
      const { items, title } = await getFeedItems(f.url);
      console.log(`   ✅ Found ${items.length} items for ${f.source} (title: ${title})`);
      // Limit items to e.g. 100 to avoid huge posts:
      const toSend = items.slice(0, 200);

      for (const item of toSend) {
        const job = {
          title: item.title || "",
          company: item.creator || item.author || "",
          location: item.categories ? item.categories.join(", ") : (item.location || ""),
          source: f.source,
          link: item.link || item.guid || "",
          description: (item.contentSnippet || item.content || "").replace(/<\/?[^>]+(>|$)/g, "").slice(0, 1200),
          datePosted: item.pubDate || item.isoDate || "",
        };

        if (!job.link) {
          console.log("   ⚠️ Skip (no link):", job.title.slice(0, 60));
          continue;
        }

        try {
          const result = await postToAppScript(job);
          console.log("   Posted =>", result.status, result.body ? result.body.slice(0, 120) : "");
        } catch (pe) {
          console.error("   ❌ POST failed:", pe.message || pe.toString());
        }
        // small pause between posts
        await wait(250);
      }
    } catch (err) {
      console.warn("   ⚠️ Feed error for", f.source, ":", err.message || err.toString());
    }
    // small pause between feeds
    await wait(400);
  }

  console.log("\n✅ Aggregator finished.");
})();
