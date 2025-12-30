// pages/api/search.js

export default async function handler(req, res) {
  try {
    const SHEET_URL =
      "https://script.google.com/macros/s/AKfycbyJFzC1seakm3y5BK8d-W7OPSLI1KqE1hXeeVqR_IaCuvbNDsexy8Ey4SY3k-DAL2ta/exec";

    const {
      category,
      location,
      q,            // 🔹 Search keyword
      page = 1,
      limit = 10,
    } = req.query;

    const response = await fetch(`${SHEET_URL}?limit=1000`);
    const data = await response.json();

    let jobs = Array.isArray(data.jobs) ? data.jobs : [];

    // 🔹 CATEGORY KEYWORD MAPPING
    const categoryMap = {
      "govt-jobs": ["government", "govt", "sarkari", "psu", "ministry"],
      banking: ["bank", "banking", "ibps", "rbi", "sbi"],
      it: ["it", "software", "developer", "engineer", "programmer"],
      bpo: ["bpo", "call center", "customer support", "telecaller"],
      sales: ["sales", "marketing", "business development"],
      engineering: ["engineer", "mechanical", "civil", "electrical"],
    };

    // 🔹 AI & WFH keyword lists
    const aiKeywords = [
      "ai",
      "artificial intelligence",
      "machine learning",
      "ml",
      "deep learning",
      "data scientist",
      "data science",
      "chatgpt",
      "openai",
      "python",
      "nlp",
      "genai"
    ];

    const wfhKeywords = ["work from home", "remote", "wfh"];

    // 🔹 Apply category filter
    if (category) {
      if (category === "ai") {
        // AI Jobs: keyword-based filter
        jobs = jobs.filter((job) => {
          const text = `${job.title || ""} ${job.description || ""}`.toLowerCase();
          return aiKeywords.some((kw) => text.includes(kw));
        });
      } else if (category === "work-from-home") {
        // Work From Home Jobs: keyword-based filter
        jobs = jobs.filter((job) => {
          const text = `${job.title || ""} ${job.description || ""}`.toLowerCase();
          return wfhKeywords.some((kw) => text.includes(kw));
        });
      } else if (categoryMap[category]) {
        const keywords = categoryMap[category];
        jobs = jobs.filter((job) => {
          const text = `${job.title || ""} ${job.company || ""} ${job.category || ""}`.toLowerCase();
          return keywords.some((word) => text.includes(word));
        });
      }
    }

    // 🔹 Location filter
    if (location && location.toLowerCase() !== "india") {
      jobs = jobs.filter(
        (job) =>
          job.location &&
          job.location.toLowerCase().includes(location.toLowerCase())
      );
    }

    // 🔹 Search keyword filter
    if (q && q.trim() !== "") {
      const keyword = q.toLowerCase();

      jobs = jobs.filter((job) => {
        const text = `
          ${job.title || ""}
          ${job.company || ""}
          ${job.category || ""}
          ${job.location || ""}
          ${job.description || ""}
          ${job.snippet || ""}
        `.toLowerCase();

        return text.includes(keyword);
      });
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