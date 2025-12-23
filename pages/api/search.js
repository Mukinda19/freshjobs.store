export default async function handler(req, res) {
  try {
    const SHEET_URL =
      "https://script.google.com/macros/s/AKfycbyJFzC1seakm3y5BK8d-W7OPSLI1KqE1hXeeVqR_IaCuvbNDsexy8Ey4SY3k-DAL2ta/exec";

    const response = await fetch(`${SHEET_URL}?limit=500`);
    const data = await response.json();

    let jobs = Array.isArray(data.jobs) ? data.jobs : [];

    const { category, location } = req.query;

    // ✅ CATEGORY FILTER (Govt handled properly)
    if (category) {
      const cat = category.toLowerCase();

      jobs = jobs.filter((job) => {
        if (!job.category) return false;

        const jobCat = job.category.toLowerCase();

        // Government jobs special case
        if (cat.includes("gov")) {
          return (
            jobCat.includes("gov") ||
            jobCat.includes("government")
          );
        }

        return jobCat.includes(cat);
      });
    }

    // ✅ LOCATION FILTER (ignore india)
    if (location && location.toLowerCase() !== "india") {
      jobs = jobs.filter(
        (job) =>
          job.location &&
          job.location.toLowerCase().includes(location.toLowerCase())
      );
    }

    return res.status(200).json(jobs);
  } catch (err) {
    console.error("API error:", err);
    return res.status(500).json([]);
  }
}