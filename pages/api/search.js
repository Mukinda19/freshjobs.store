// pages/api/search.js
export default async function handler(req, res) {
  try {
    const SHEET_URL = "https://script.google.com/macros/s/AKfycbyJFzC1seakm3y5BK8d-W7OPSLI1KqE1hXeeVqR_IaCuvbNDsexy8Ey4SY3k-DAL2ta/exec";

    // Fetch all jobs from Apps Script
    const response = await fetch(`${SHEET_URL}?limit=500`);
    const data = await response.json();

    if (!data.jobs) {
      return res.status(200).json({ jobs: [] });
    }

    let jobs = data.jobs;

    // Filter by category & location if query params exist
    const { category, location } = req.query;

    if (category) {
      jobs = jobs.filter(
        (job) => job.category.toLowerCase() === category.toLowerCase()
      );
    }

    if (location) {
      jobs = jobs.filter(
        (job) => job.location && job.location.toLowerCase() === location.toLowerCase()
      );
    }

    res.status(200).json(jobs);
  } catch (err) {
    console.error("API error:", err);
    res.status(500).json({ jobs: [], error: err.message });
  }
}