// pages/api/search.js

export default async function handler(req, res) {
  try {
    const SHEET_URL =
      "https://script.google.com/macros/s/AKfycbyJFzC1seakm3y5BK8d-W7OPSLI1KqE1hXeeVqR_IaCuvbNDsexy8Ey4SY3k-DAL2ta/exec";

    const { category, location, q, page = 1, limit = 10 } = req.query;

    const response = await fetch(`${SHEET_URL}?limit=1000`);
    const data = await response.json();

    let jobs = Array.isArray(data.jobs) ? data.jobs : [];

    /* ---------------- KEYWORDS ---------------- */

    const aiKeywords = [
      "ai",
      "artificial intelligence",
      "machine learning",
      "deep learning",
      "data scientist",
      "data science",
      "genai",
      "nlp",
      "chatgpt",
      "openai",
    ];

    const wfhKeywords = [
      "work from home",
      "remote",
      "wfh",
      "anywhere",
      "worldwide",
    ];

    const categoryMap = {
      "govt-jobs": ["government", "govt", "sarkari", "psu"],
      banking: ["bank", "banking", "ibps", "rbi", "sbi"],
      it: ["software", "developer", "engineer", "programmer"],
      bpo: ["bpo", "call center", "customer support"],
      sales: ["sales", "marketing"],
      engineering: ["mechanical", "civil", "electrical"],
    };

    /* ---------------- CATEGORY FILTER ---------------- */

    if (category) {
      const cat = category.toLowerCase();

      /* ✅ AI JOBS (safe mode) */
      if (cat === "ai" || cat === "ai-jobs") {
        const aiFiltered = jobs.filter((job) => {
          const text = `
            ${job.title || ""}
            ${job.description || ""}
            ${job.snippet || ""}
            ${job.category || ""}
            ${job.company || ""}
          `.toLowerCase();

          return aiKeywords.some((kw) => text.includes(kw));
        });

        // 🔒 fallback: agar data me keyword nahi mila
        if (aiFiltered.length > 0) {
          jobs = aiFiltered;
        }
      }

      /* ✅ WORK FROM HOME (global, no location cut) */
      else if (cat === "work-from-home" || cat === "wfh") {
        jobs = jobs.filter((job) => {
          const text = `
            ${job.title || ""}
            ${job.description || ""}
            ${job.snippet || ""}
            ${job.location || ""}
          `.toLowerCase();

          return wfhKeywords.some((kw) => text.includes(kw));
        });
      }

      /* ✅ NORMAL CATEGORIES */
      else if (categoryMap[cat]) {
        const keywords = categoryMap[cat];

        jobs = jobs.filter((job) => {
          const text = `
            ${job.title || ""}
            ${job.company || ""}
            ${job.category || ""}
            ${job.description || ""}
          `.toLowerCase();

          return keywords.some((kw) => text.includes(kw));
        });
      }
    }

    /* ---------------- LOCATION FILTER ---------------- */
    // ❗ AI & WFH ke liye location ignore
    if (
      location &&
      location.toLowerCase() !== "india" &&
      category !== "ai-jobs" &&
      category !== "work-from-home"
    ) {
      jobs = jobs.filter(
        (job) =>
          job.location &&
          job.location.toLowerCase().includes(location.toLowerCase())
      );
    }

    /* ---------------- SEARCH FILTER ---------------- */

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

    /* ---------------- PAGINATION ---------------- */

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