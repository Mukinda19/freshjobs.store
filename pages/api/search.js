// pages/api/search.js

let cachedJobs = null
let lastFetchTime = 0
const CACHE_DURATION = 5 * 60 * 1000

const generateSlug = (text = "", fallback = "") => {
  const base = text || fallback || "job-opening"
  return base
    .toLowerCase()
    .replace(/<[^>]*>?/gm, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "")
}

const buildText = (job) =>
  [
    job.title,
    job.description,
    job.snippet,
    job.location,
    job.company,
  ]
    .join(" ")
    .toLowerCase()

// 🔥 Category detection engine
const detectCategory = (job) => {
  const text = buildText(job)

  if (text.includes("artificial intelligence") || text.includes("machine learning") || text.includes("data scientist") || text.includes("ai "))
    return "ai-jobs"

  if (text.includes("work from home") || text.includes("remote") || text.includes("wfh"))
    return "work-from-home"

  if (text.includes("government") || text.includes("govt") || text.includes("sarkari") || text.includes("railway") || text.includes("ssc") || text.includes("upsc"))
    return "government-jobs"

  if (text.includes("bank") || text.includes("finance") || text.includes("loan") || text.includes("credit"))
    return "banking-jobs"

  if (text.includes("bpo") || text.includes("call center") || text.includes("customer support"))
    return "bpo-jobs"

  if (text.includes("sales") || text.includes("business development") || text.includes("marketing"))
    return "sales-jobs"

  if (text.includes("engineer") || text.includes("mechanical") || text.includes("civil") || text.includes("electrical"))
    return "engineering-jobs"

  if (text.includes("developer") || text.includes("software") || text.includes("programmer") || text.includes("web"))
    return "it-jobs"

  return "general"
}

export default async function handler(req, res) {
  res.setHeader("Cache-Control", "s-maxage=600, stale-while-revalidate")

  try {
    const SHEET_URL =
      "https://script.google.com/macros/s/AKfycbyJFzC1seakm3y5BK8d-W7OPSLI1KqE1hXeeVqR_IaCuvbNDsexy8Ey4SY3k-DAL2ta/exec"

    const { category, q, slug } = req.query
    const page = Number(req.query.page) || 1
    const limit = Math.min(Number(req.query.limit) || 10, 20)

    if (!cachedJobs || Date.now() - lastFetchTime > CACHE_DURATION) {
      const response = await fetch(`${SHEET_URL}?limit=1000`)
      const data = await response.json()

      let jobs = Array.isArray(data.jobs) ? data.jobs : []

      jobs = jobs.map((job, index) => ({
        ...job,
        slug: job.slug || generateSlug(job.title, job.link) + "-" + index,
        detectedCategory: detectCategory(job), // 🔥 assign category
      }))

      cachedJobs = jobs
      lastFetchTime = Date.now()
    }

    let jobs = [...cachedJobs]

    if (slug) {
      const job = jobs.find((j) => j.slug === slug)
      if (!job) return res.status(404).json({ job: null })
      return res.status(200).json({ job })
    }

    // 🔥 CATEGORY FILTER (guaranteed working)
    if (category) {
      const cat = category.toLowerCase()

      if (cat === "international-jobs") {
        jobs = jobs.filter((job) => job.detectedCategory !== "government-jobs")
      } else if (cat === "high-paying-wfh") {
        jobs = jobs.filter(
          (job) =>
            job.detectedCategory === "work-from-home" &&
            buildText(job).includes("salary")
        )
      } else {
        jobs = jobs.filter((job) => job.detectedCategory === cat)
      }
    }

    if (q && q.trim() !== "") {
      const keyword = q.toLowerCase()
      jobs = jobs.filter((job) => buildText(job).includes(keyword))
    }

    const start = (page - 1) * limit
    const totalPages = Math.ceil(jobs.length / limit)

    return res.status(200).json({
      jobs: jobs.slice(start, start + limit),
      total: jobs.length,
      page,
      totalPages,
    })
  } catch (err) {
    console.error("API error:", err)
    return res.status(500).json({
      jobs: [],
      total: 0,
      page: 1,
      totalPages: 1,
    })
  }
}