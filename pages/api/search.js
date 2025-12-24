// pages/api/search.js

const CATEGORY_KEYWORDS = {
  "govt-jobs": ["government", "govt", "sarkari"],
  banking: ["bank", "banking"],
  it: ["it", "software", "developer", "engineer"],
  bpo: ["bpo", "call center", "voice", "process"],
  sales: ["sales", "marketing", "business development"],
  engineering: ["engineer", "mechanical", "civil", "electrical"],
};

export default async function handler(req, res) {
  try {
    const SHEET_URL =
      "https://script.google.com/macros/s/AKfycbyJFzC1seakm3y5BK8d-W7OPSLI1KqE1hXeeVqR_IaCuvbNDsexy8Ey4SY3k-DAL2ta/exec";

    const { category, location, page = 1, limit = 10 } = req.query;

    const response = await fetch(`${SHEET_URL}?limit=2000`);
    const data = await response.json();

    let jobs = Array.isArray(data.jobs) ? data.jobs : [];

    // 🔹 Category keyword based filter
    if (category && CATEGORY_KEYWORDS[category]) {
      const keywords = CATEGORY_KEYWORDS[category];

      jobs = jobs.filter(job => {
        const text = `${job.title} ${job.category}`.toLowerCase();
        return keywords.some(k => text.includes(k));
      });
    }

    // 🔹 Location filter
    if (location && location.toLowerCase() !== "india") {
      jobs = jobs.filter(job =>
        job.location?.toLowerCase().includes(location.toLowerCase())
      );
    }

    // 🔹 Pagination
    const pageNum = parseInt(page);
    const pageLimit = parseInt(limit);
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