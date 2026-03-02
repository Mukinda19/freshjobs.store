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

    const keywordsMap = {
      "ai": ["ai","artificial intelligence","machine learning","ml","deep learning","data scientist","nlp"],
      "ai-jobs": ["ai","artificial intelligence","machine learning","ml","deep learning","data scientist","nlp"],

      "work-from-home": ["work from home","remote","wfh","anywhere","worldwide"],

      "government-jobs": ["government","govt","sarkari","railway","ssc","upsc"],

      "it-jobs": ["software","developer","it","programmer","web","app","tech","engineer"],

      "banking-jobs": ["bank","banking","finance","loan","credit","branch"],

      "bpo-jobs": ["bpo","call center","customer support","telecaller","voice process"],

      "sales-jobs": ["sales","business development","field sales","marketing executive"],

      "engineering-jobs": ["engineer","mechanical","civil","electrical","production","manufacturing"]
    }

    if (category) {
      const cat = category.toLowerCase()

      // International = Non Govt
      if (cat === "international" || cat === "international-jobs") {
        const govtKeywords = ["government","govt","sarkari","railway","ssc","upsc"]

        jobs = jobs.filter((job) =>
          !govtKeywords.some((kw) =>
            buildText(job, ["title","description","snippet"]).includes(kw)
          )
        )
      }

      // High Paying WFH
      else if (cat === "high-paying-wfh") {
        jobs = jobs.filter((job) => {
          const text = buildText(job, ["title","description","snippet","location","company"])
          const isRemote = ["work from home","remote","wfh"].some(k => text.includes(k))
          const isHighPay =
            text.includes("salary") ||
            text.includes("lpa") ||
            text.includes("per month") ||
            text.includes("₹") ||
            text.includes("$")

          return isRemote && isHighPay
        })
      }

      // Normal Category Filters
      else if (keywordsMap[cat]) {
        const keywords = keywordsMap[cat]

        jobs = jobs.filter((job) =>
          keywords.some((kw) =>
            buildText(job, ["title","description","snippet","location","company"]).includes(kw)
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