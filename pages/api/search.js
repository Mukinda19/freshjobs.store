// pages/api/search.js

const CATEGORY_MAP = {
  "govt-jobs": "government",
  government: "government",

  "it-jobs": "it",
  it: "it",

  "banking-jobs": "banking",
  banking: "banking",

  "bpo-jobs": "bpo",
  bpo: "bpo",

  "engineering-jobs": "engineering",
  engineering: "engineering",
};

const CATEGORY_KEYWORDS = {
  government: ["government", "govt", "sarkari", "psu", "public"],
  banking: ["bank", "banking", "clerk", "po", "finance"],
  it: ["it", "software", "developer", "engineer", "computer", "programmer"],
  bpo: ["bpo", "call center", "customer", "telecaller"],
  engineering: ["engineer", "mechanical", "civil", "electrical"],
};

export default async function handler(req, res) {
  try {
    const SHEET_URL =
      "https://script.google.com/macros/s/AKfycbyJFzC1seakm3y5BK8d-W7OPSLI1KqE1hXeeVqR_IaCuvbNDsexy8Ey4SY3k-DAL2ta/exec";

    let { category, location, page = 1, limit = 10 } = req.query;

    // ✅ Normalize category slug
    const normalizedCategory = CATEGORY_MAP[category] || category;

    const response = await fetch(`${SHEET_URL}?limit=3000`);
    const data = await response.json();
    let jobs = Array.isArray(data.jobs) ? data.jobs : [];

    // ✅ Category filtering
    if (normalizedCategory && CATEGORY_KEYWORDS[normalizedCategory]) {
      const keywords = CATEGORY_KEYWORDS[normalizedCategory];

      jobs = jobs.filter(job => {
        const text = `${job.title} ${job.category} ${job.company}`.toLowerCase();
        return keywords.some(k => text.includes(k));
      });
    }

    // ✅ Location filter
    if (location && location.toLowerCase() !== "india") {
      jobs = jobs.filter(job =>
        job.location?.toLowerCase().includes(location.toLowerCase())
      );
    }

    // ✅ Pagination
    const pageNum = Number(page);
    const pageLimit = Number(limit);
    const start = (pageNum - 1) * pageLimit;

    return res.status(200).json({
      jobs: jobs.slice(start, start + pageLimit),
      total: jobs.length,
      page: pageNum,
      totalPages: Math.ceil(jobs.length / pageLimit),
    });
  } catch (error) {
    console.error("API error:", error);
    return res.status(500).json({ jobs: [], total: 0, page: 1, totalPages: 1 });
  }
}