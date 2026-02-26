// pages/api/search.js

let cachedJobs = null
let lastFetchTime = 0
const CACHE_DURATION = 5 * 60 * 1000 // 5 min

const generateSlug = (text = "", fallback = "") => {
  const base = text || fallback || "job-opening"
  return base
    .toLowerCase()
    .replace(/<[^>]*>?/gm, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "")
}

export default async function handler(req, res) {
  res.setHeader("Cache-Control", "s-maxage=600, stale-while-revalidate")

  try {
    const SHEET_URL =
      "https://script.google.com/macros/s/AKfycbyJFzC1seakm3y5BK8d-W7OPSLI1KqE1hXeeVqR_IaCuvbNDsexy8Ey4SY3k-DAL2ta/exec"

    const { category, q, slug } = req.query
    const page = Number(req.query.page) || 1
    const limit = Math.min(Number(req.query.limit) || 10, 20)

    /* ===== CACHE LOAD ===== */
    if (!cachedJobs || Date.now() - lastFetchTime > CACHE_DURATION) {
      const response = await fetch(`${SHEET_URL}?limit=1000`)
      const data = await response.json()

      let jobs = Array.isArray(data.jobs) ? data.jobs : []

      jobs = jobs.map((job, index) => ({
        ...job,
        slug:
          job.slug ||
          generateSlug(job.title, job.link) + "-" + index,
      }))

      cachedJobs = jobs
      lastFetchTime = Date.now()
    }

    let jobs = [...cachedJobs]

    /* ================= SLUG DIRECT FETCH ================= */

    if (slug) {
      const job = jobs.find((j) => j.slug === slug)

      if (!job) {
        return res.status(404).json({ job: null })
      }

      return res.status(200).json({ job })
    }

    /* ================= CATEGORY FILTER ================= */

    const buildText = (job, fields) =>
      fields.map((f) => job[f] || "").join(" ").toLowerCase()

    const aiKeywords = [
      "ai","artificial intelligence","machine learning",
      "ml","deep learning","data scientist","nlp"
    ]

    const wfhKeywords = [
      "work from home","remote","wfh","anywhere","worldwide"
    ]

    const govtKeywords = [
      "government","govt","sarkari","railway","ssc","upsc"
    ]

    if (category) {
      const cat = category.toLowerCase()

      if (cat === "ai" || cat === "ai-jobs") {
        jobs = jobs.filter((job) =>
          aiKeywords.some((kw) =>
            buildText(job, ["title","description","snippet"]).includes(kw)
          )
        )
      }

      else if (cat === "work-from-home") {
        jobs = jobs.filter((job) =>
          wfhKeywords.some((kw) =>
            buildText(job, ["title","description","snippet","location"]).includes(kw)
          )
        )
      }

      else if (cat === "international" || cat === "international-jobs") {
        jobs = jobs.filter((job) =>
          !govtKeywords.some((kw) =>
            buildText(job, ["title","description"]).includes(kw)
          )
        )
      }
    }

    /* ================= SEARCH ================= */

    if (q && q.trim() !== "") {
      const keyword = q.toLowerCase()
      jobs = jobs.filter((job) =>
        buildText(job, ["title","description","company"]).includes(keyword)
      )
    }

    /* ================= PAGINATION ================= */

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