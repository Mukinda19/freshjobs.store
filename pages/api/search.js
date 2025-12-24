// pages/api/search.js

const CATEGORY_KEYWORDS = {
  government: ["government", "govt", "sarkari", "psu", "public"],
  banking: ["bank", "banking", "clerk", "po", "finance"],
  it: ["it", "software", "developer", "engineer", "computer", "programmer"],
  bpo: ["bpo", "call center", "customer", "telecaller"],
  sales: ["sales", "marketing", "business development"],
  engineering: ["engineer", "technical", "mechanical", "civil", "electrical"],
};

export default async function handler(req, res) {
  try {
    const SHEET_URL =
      "https://script.google.com/macros/s/AKfycbyJFzC1seakm3y5BK8d-W7OPSLI1KqE1hXeeVqR_IaCuvbNDsexy8Ey4SY3k-DAL2ta/exec";

    const { category, location, page = 1, limit = 10 } = req.query;

    const response = await fetch(`${SHEET_URL}?limit=2000`);
    const data = await response.json();

    let jobs = Array.isArray(data.jobs) ? data.jobs : [];

    // ✅ SMART CATEGORY FILTER
    if (category && CATEGORY_KEYWORDS[category.toLowerCase()]) {
      const keywords = CATEGORY_KEYWORDS[category.toLowerCase()];

      jobs = jobs.filter(job => {
        const text = `${job.title} ${job.category} ${job.company}`.toLowerCase();
        return keywords.some(keyword => text.includes(keyword));
      });
    }

    // ✅ LOCATION FILTER
    if (location && location.toLowerCase() !== "india") {
      jobs = jobs.filter(job =>
        job.location?.toLowerCase().includes(location.toLowerCase())
      );
    }

    // ✅ PAGINATION
    const pageNum = Number(page);
    const pageLimit = Number(limit);
    const start = (pageNum - 1) * pageLimit;
    const end = start + pageLimit;

    return res.status(200).json({
      jobs: jobs.slice(start, end),
      total: jobs.length,
      page: pageNum,
      totalPages: Math.ceil(jobs.length / pageLimit),
    });
  } catch (error) {
    console.error("Search API Error:", error);
    return res.status(500).json({
      jobs: [],
      total: 0,
      page: 1,
      totalPages: 1,
    });
  }
}