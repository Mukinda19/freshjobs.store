const BASE_URL =
  process.env.NEXT_PUBLIC_BASE_URL || "";

/**
 * Fetch all jobs (or filtered jobs) from internal API
 * @param {string} query - example: ?category=it&location=pune
 */
export async function fetchJobs(query = "") {
  try {
    const res = await fetch(`${BASE_URL}/api/search${query}`);

    if (!res.ok) {
      console.error("fetchJobs failed:", res.status);
      return [];
    }

    const data = await res.json();

    // API returns array directly
    return Array.isArray(data) ? data : data.jobs || [];
  } catch (err) {
    console.error("fetchJobs error:", err);
    return [];
  }
}

/**
 * Fetch only government jobs (optional helper)
 */
export async function fetchGovtJobs() {
  try {
    const res = await fetch(`${BASE_URL}/api/search?category=government`);

    if (!res.ok) return [];

    const data = await res.json();
    return Array.isArray(data) ? data : data.jobs || [];
  } catch (err) {
    console.error("fetchGovtJobs error:", err);
    return [];
  }
}