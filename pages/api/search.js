// pages/api/search.js

/* 🔹 SIMPLE MEMORY CACHE */
let cachedJobs = null
let lastFetchTime = 0
const CACHE_DURATION = 5 * 60 * 1000 // 5 minutes

/* 🔹 SLUG GENERATOR */
const generateSlug = (text = "", fallback = "") => {
  const base = text || fallback || "job-opening"
  return base
    .toLowerCase()
    .replace(/<[^>]*>?/gm, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "")
}

export default async function handler(req, res) {
  /* ✅ VERCEL EDGE CACHE */
  res.setHeader(
    "Cache-Control",
    "s-maxage=600, stale-while-revalidate"
  )

  try {
    const SHEET_URL =
      "https://script.google.com/macros/s/AKfycbyJFzC1seakm3y5BK8d-W7OPSLI1KqE1hXeeVqR_IaCuvbNDsexy8Ey4SY3k-DAL2ta/exec"

    const { category, q } = req.query
    const page = Number(req.query.page) || 1

    /* ✅ LIMIT SAFETY CAP (Max 20) */
    const limit = Math.min(Number(req.query.limit) || 10, 20)

    /* 🔥 CACHE CHECK */
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

    /* ================= KEYWORDS ================= */

    const aiKeywords = [
      "ai","artificial intelligence","machine learning","ml",
      "deep learning","data scientist","data science",
      "genai","nlp","chatgpt","openai",
    ]

    const wfhKeywords = [
      "work from home","remote","wfh",
      "anywhere","worldwide","work anywhere",
    ]

    const govtKeywords = [
      "government","govt","sarkari","psu","ssc","upsc",
      "railway","defence","police","court","ministry",
    ]

    const indiaKeywords = [
      "india","indian","bharat","new delhi","delhi",
      "mumbai","pune","bangalore","bengaluru",
      "chennai","hyderabad","kolkata","ahmedabad",
      "noida","gurgaon","maharashtra",
      "uttar pradesh","bihar","madhya pradesh",
      "rajasthan","tamil nadu","karnataka",
    ]

    const internationalDomains = [
      "remoteok","weworkremotely","remotive","jobicy",
    ]

    const normalCategoryMap = {
      "govt-jobs": govtKeywords,
      banking: ["bank","banking","ibps","rbi","sbi"],
      it: ["software","developer","engineer","programmer"],
      bpo: ["bpo","call center","customer support"],
      sales: ["sales","marketing"],
      engineering: ["mechanical","civil","electrical"],
    }

    /* ================= CATEGORY FILTER ================= */

    if (category) {
      const cat = category.toLowerCase()

      const buildText = (job, fields) =>
        fields.map((f) => job[f] || "").join(" ").toLowerCase()

      if (cat === "ai" || cat === "ai-jobs") {
        jobs = jobs.filter((job) =>
          aiKeywords.some((kw) =>
            buildText(job, ["title","description","snippet","company"]).includes(kw)
          )
        )
      }

      else if (cat === "work-from-home" || cat === "wfh") {
        jobs = jobs.filter((job) =>
          wfhKeywords.some((kw) =>
            buildText(job, ["title","description","snippet","location"]).includes(kw)
          )
        )
      }

      else if (cat === "international" || cat === "international-jobs") {
        jobs = jobs.filter((job) => {
          const text = buildText(job, ["title","description","snippet"])
          const urlText = buildText(job, ["url","link","apply_url","source"])

          const isInternationalSource = internationalDomains.some((d) =>
            urlText.includes(d)
          )

          const isGovt = govtKeywords.some((kw) => text.includes(kw))
          const isIndia = indiaKeywords.some((kw) => text.includes(kw))

          return isInternationalSource && !isGovt && !isIndia
        })
      }

      else if (normalCategoryMap[cat]) {
        const keywords = normalCategoryMap[cat]

        jobs = jobs.filter((job) =>
          keywords.some((kw) =>
            buildText(job, ["title","description","category","company"]).includes(kw)
          )
        )
      }
    }

    /* ================= SEARCH ================= */

    if (q && q.trim() !== "") {
      const keyword = q.toLowerCase()
      jobs = jobs.filter((job) =>
        ["title","description","snippet","company"]
          .map((f) => job[f] || "")
          .join(" ")
          .toLowerCase()
          .includes(keyword)
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