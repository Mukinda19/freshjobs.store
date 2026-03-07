import fs from "fs";
import path from "path";
import Parser from "rss-parser";
import crypto from "crypto";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const APPSCRIPT_POST_URL =
  "https://script.google.com/macros/s/AKfycbyJFzC1seakm3y5BK8d-W7OPSLI1KqE1hXeeVqR_IaCuvbNDsexy8Ey4SY3k-DAL2ta/exec";

const FEEDS_PATH = path.join(__dirname, "feeds.json");
const DATA_DIR = path.join(__dirname, "../data");
const SEEN_FILE = path.join(DATA_DIR, "seen.json");

if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

const parser = new Parser({
  timeout: 15000,
  headers: {
    "User-Agent": "Mozilla/5.0 FreshJobsBot"
  }
});

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

/* ---------------- CATEGORY DETECTOR ---------------- */

function detectCategory(feedCategory, title) {

  const t = (title || "").toLowerCase()

  /* GOVT JOBS */
  if (feedCategory === "govt") {
    return "govt-jobs"
  }

  /* WFH / REMOTE FEEDS */
  if (feedCategory === "wfh") {
    return "work-from-home"
  }

  /* AI JOBS */
  const aiWords = [
    "artificial intelligence",
    "machine learning",
    "deep learning",
    "ml engineer",
    "ai engineer",
    "ai developer",
    "data scientist",
    "nlp",
    "computer vision"
  ]

  if (aiWords.some(w => t.includes(w))) {
    return "ai"
  }

  /* REMOTE DETECTION */
  const remoteWords = [
    "remote",
    "work from home",
    "wfh",
    "anywhere",
    "distributed"
  ]

  if (remoteWords.some(w => t.includes(w))) {
    return "work-from-home"
  }

  return "general"
}

/* ---------------- NEWS FILTER ---------------- */

function isNews(title) {

  const t = (title || "").toLowerCase()

  const badWords = [
    "tension",
    "war",
    "missile",
    "attack",
    "politics",
    "news",
    "conflict",
    "students",
    "college",
    "exam result",
    "admit card",
    "answer key",
    "cut off",
    "syllabus"
  ]

  return badWords.some((w) => t.includes(w))
}

/* ---------------- MAIN FETCH ---------------- */

async function main() {

  console.log("🚀 Job fetch started")

  const feeds = JSON.parse(fs.readFileSync(FEEDS_PATH, "utf8"))
  const seen = loadSeen()

  for (const f of feeds) {

    try {

      console.log(`🔎 Reading feed: ${f.source}`)

      const res = await fetch(f.url)
      const xml = await res.text()
      const feed = await parser.parseString(xml)

      for (const item of feed.items.slice(0, 25)) {

        const link = item.link || ""
        const id = hash(link)

        if (!link || seen[id]) continue

        const title = item.title || ""

        if (isNews(title)) continue

        const category = detectCategory(f.category, title)

        const job = {
          title,
          company: item.creator || item.author || f.source,
          location: "",
          category,
          source: f.source,
          link,
          description:
            item.contentSnippet ||
            item.summary ||
            "Check job details and apply using the official link.",
          datePosted: item.pubDate || new Date().toISOString()
        }

        const post = await fetch(APPSCRIPT_POST_URL, {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify(job)
        })

        if (post.ok) {

          seen[id] = true
          saveSeen(seen)

          console.log(`✅ Posted: ${title}`)

        }

        await wait(400)

      }

    } catch (err) {

      console.log(`⚠️ Feed error (${f.source}):`, err.message)

    }

  }

  console.log("✅ Fetch completed")

}

main().catch((err) => {

  console.error("❌ Fatal error:", err)

  process.exit(1)

})