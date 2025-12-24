// pages/api/search.js

const CATEGORY_KEYWORDS = {
  government: ["government", "govt", "sarkari", "psu", "railway", "ssc"],
  banking: ["bank", "banking", "finance", "loan"],
  it: ["it", "software", "developer", "programmer", "computer", "web", "app"],
  engineering: ["engineer", "engineering", "mechanical", "civil", "electrical"],
  sales: ["sales", "marketing", "business development", "field work"],
  bpo: ["bpo", "call center", "customer support", "telecaller"],
};

function detectCategories(job) {
  const text = `
    ${job.title || ""}
    ${job.company || ""}
    ${job.snippet || ""}
    ${job.category || ""}
  `.toLowerCase();

  const matched = [];

  for (const [category, keywords] of Object.entries(CATEGORY_KEYWORDS)) {
    if (keywords.some(word => text.includes(word))) {
      matched.push(category);
    }
  }

  return matched.length ? matched : ["other"];
}

export default async function handler(req, res) {
  try {
    const SHEET_URL =
      "https://script.google.com/macros/s/AKfycbyJFzC1seakm3y5BK8d-W7OPSLI1KqE1hXeeVqR_IaCuvbNDsexy8Ey4SY3k-DAL2ta/exec";

    const { category, location, search, page = 1, limit = 10 } = req.query;

    const response = await fetch(`${SHEET_URL}?limit=1000`);
    const data = await response.json();
    let jobs = Array.isArray(data.jobs) ? data.jobs : [];

    // 🔹 Detect multiple categories per job
    jobs = jobs.map(job => ({
      ...job,
      detectedCategories: detectCategories(job),
    }));

    // 🔹 Category filter (popular categories)
    if (category && category !== "all") {
      jobs = jobs.filter(job =>
        job.detectedCategories.includes(category.toLowerCase())
      );
    }

    // 🔹 Location filter
    if (location && location.toLowerCase() !== "india") {
      jobs = jobs.filter(
        job =>
          job.location &&
          job.location.toLowerCase().includes(location.toLowerCase())
      );
    }

    // 🔹 Search keyword
    if (search) {
      const q = search.toLowerCase();
      jobs = jobs.filter(job =>
        `${job.title} ${job.company} ${job.snippet}`
          .toLowerCase()
          .includes(q)
      );
    }

    // 🔹 Pagination
    const pageNum = parseInt(page);
    const pageLimit = parseInt(limit);
    const start = (pageNum - 1) * pageLimit;

    return res.status(200).json({
      jobs: jobs.slice(start, start + pageLimit),
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