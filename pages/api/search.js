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

const buildText = (job, fields) =>
  fields.map((f) => job[f] || "").join(" ").toLowerCase()

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
        slug:
          job.slug ||
          generateSlug(job.title, job.link) + "-" + index,
      }))

      cachedJobs = jobs
      lastFetchTime = Date.now()
    }

    let jobs = [...cachedJobs]

    /* ========= SLUG ========= */
    if (slug) {
      const job = jobs.find((j) => j.slug === slug)
      if (!job) return res.status(404).json({ job: null })
      return res.status(200).json({ job })
    }

    /* ========= CATEGORY FILTER (RESTORED WORKING LOGIC) ========= */

    const keywordsMap = {
      "ai-jobs": ["ai","artificial intelligence","machine learning","ml","data"],
      "work-from-home": ["work from home","remote","wfh"],
      "government-jobs": ["government","govt","sarkari","railway","ssc","upsc"],
      "it-jobs": ["developer","software","it","programmer","web","tech","react","node"],
      "banking-jobs": ["bank","finance","loan","credit"],
      "bpo-jobs": ["bpo","call center","customer support"],
      "sales-jobs": ["sales","marketing","business development"],
      "engineering-jobs": ["engineer","mechanical","civil","electrical"]
    }

    if (category) {
      const cat = category.toLowerCase()

      if (keywordsMap[cat]) {
        const keywords = keywordsMap[cat]

        jobs = jobs.filter((job) =>
          keywords.some((kw) =>
            buildText(job, ["title","description","snippet","location","company"]).includes(kw)
          )
        )
      }

      // International = remove govt jobs
      if (cat === "international-jobs") {
        jobs = jobs.filter((job) =>
          !buildText(job, ["title","description"]).includes("government")
        )
      }

      // High Paying WFH
      if (cat === "high-paying-wfh") {
        jobs = jobs.filter((job) =>
          buildText(job, ["title","description"]).includes("salary")
        )
      }
    }

    /* ========= SEARCH ========= */
    if (q && q.trim() !== "") {
      const keyword = q.toLowerCase()
      jobs = jobs.filter((job) =>
        buildText(job, ["title","description","company"]).includes(keyword)
      )
    }

    /* ========= PAGINATION ========= */
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