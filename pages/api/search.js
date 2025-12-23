// pages/api/search.js

export default async function handler(req, res) {
  try {
    const SHEET_URL =
      "https://script.google.com/macros/s/AKfycbyJFzC1seakm3y5BK8d-W7OPSLI1KqE1hXeeVqR_IaCuvbNDsexy8Ey4SY3k-DAL2ta/exec";

    const { category, location, page = 1, limit = 10 } = req.query;

    // Fetch all jobs from Apps Script
    const response = await fetch(`${SHEET_URL}?limit=1000`);
    const data = await response.json();
    let jobs = Array.isArray(data.jobs) ? data.jobs : [];

    // 🔹 Category filter
    if (category) {
      jobs = jobs.filter(
        job =>
          job.category &&
          job.category.toLowerCase().includes(category.toLowerCase())
      );
    }

    // 🔹 Location filter (india = all)
    if (location && location.toLowerCase() !== "india") {
      jobs = jobs.filter(
        job =>
          job.location &&
          job.location.toLowerCase().includes(location.toLowerCase())
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
    return res.status(500).json({ jobs: [], total: 0, page: 1, totalPages: 1 });
  }
}