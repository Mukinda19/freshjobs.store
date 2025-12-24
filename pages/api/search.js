// pages/api/search.js

const CATEGORY_KEYWORDS = {
  government: ["government", "govt", "sarkari", "public sector", "psu"],
  banking: ["bank", "banking", "finance", "account", "accounts"],
  it: [
    "it",
    "information technology",
    "software",
    "developer",
    "programmer",
    "engineer",
    "computer",
    "web",
    "frontend",
    "backend",
    "full stack",
    "data",
    "cloud",
    "network",
    "cyber",
    "ai",
    "ml",
  ],
  bpo: ["bpo", "call center", "customer support", "voice", "non voice"],
  sales: ["sales", "marketing", "business development"],
  engineering: ["engineer", "engineering", "mechanical", "civil", "electrical"],
};

function matchCategory(job, category) {
  if (!category) return true;

  const keywords = CATEGORY_KEYWORDS[category.toLowerCase()];
  if (!keywords) return false;

  const text = `
    ${job.title || ""}
    ${job.category || ""}
    ${job.snippet || ""}
    ${job.company || ""}
  `.toLowerCase();

  return keywords.some(keyword => text.includes(keyword));
}

export default async function handler(req, res) {
  try {
    const SHEET_URL =
      "https://script.google.com/macros/s/AKfycbyJFzC1seakm3y5BK8d-W7OPSLI1KqE1hXeeVqR_IaCuvbNDsexy8Ey4SY3k-DAL2ta/exec";

    const { category, location, page = 1, limit = 10 } = req.query;

    // 🔹 Fetch jobs
    const response = await fetch(`${SHEET_URL}?limit=1500`);
    const data = await response.json();
    let jobs = Array.isArray(data.jobs) ? data.jobs : [];

    // 🔹 Category logic (SMART MATCHING)
    if (category) {
      jobs = jobs.filter(job => matchCategory(job, category));
    }

    // 🔹 Location logic (india = all)
    if (location && location.toLowerCase() !== "india") {
      jobs = jobs.filter(
        job =>
          job.location &&
          job.location.toLowerCase().includes(location.toLowerCase())
      );
    }

    // 🔹 Sort latest first
    jobs.sort(
      (a, b) => new Date(b.datePosted || 0) - new Date(a.datePosted || 0)
    );

    // 🔹 Pagination
    const pageNum = Math.max(parseInt(page), 1);
    const pageLimit = Math.min(parseInt(limit), 50);
    const start = (pageNum - 1) * pageLimit;
    const end = start + pageLimit;

    return res.status(200).json({
      jobs: jobs.slice(start, end),
      total: jobs.length,
      page: pageNum,
      totalPages: Math.ceil(jobs.length / pageLimit),
    });
  } catch (err) {
    console.error("API error:", err);
    return res.status(500).json({
      jobs: [],
      total: 0,
      page: 1,
      totalPages: 1,
    });
  }
}