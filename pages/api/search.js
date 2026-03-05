let cachedJobs = null
let lastFetchTime = 0

const CACHE_DURATION = 5 * 60 * 1000

/* ---------------- SLUG GENERATOR ---------------- */

const generateSlug = (text = "", fallback = "") => {
  const base = text || fallback || "job-opening"

  return base
    .toLowerCase()
    .replace(/<[^>]*>?/gm, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "")
}

/* ---------------- TEXT BUILDER ---------------- */

const buildText = (job, fields) => {
  return fields.map((f) => job[f] || "").join(" ").toLowerCase()
}

/* ---------------- REMOVE DUPLICATES ---------------- */

const dedupeJobs = (jobs) => {
  const seen = new Set()

  return jobs.filter((job) => {
    const key = `${job.title}-${job.company}-${job.location}`

    if (seen.has(key)) return false

    seen.add(key)
    return true
  })
}

/* ---------------- GOVT CHECK ---------------- */

const isGovtJob = (text) => {
  const govtKeywords = [
    "government",
    "govt",
    "sarkari",
    "railway",
    "ssc",
    "upsc",
    "public sector",
    "psu",
    "defence",
    "army",
    "navy",
    "air force",
  ]

  return govtKeywords.some((kw) => text.includes(kw))
}

export default async function handler(req, res) {
  res.setHeader("Cache-Control", "s-maxage=600, stale-while-revalidate")

  try {
    const SHEET_URL =
      "https://script.google.com/macros/s/AKfycbyJFzC1seakm3y5BK8d-W7OPSLI1KqE1hXeeVqR_IaCuvbNDsexy8Ey4SY3k-DAL2ta/exec"

    const { category, q, slug } = req.query

    const page = Math.max(Number(req.query.page) || 1, 1)
    const limit = Math.min(Number(req.query.limit) || 10, 20)

    /* ================= CACHE LOAD ================= */

    if (!cachedJobs || Date.now() - lastFetchTime > CACHE_DURATION) {
      const response = await fetch(`${SHEET_URL}?limit=1000`)
      const data = await response.json()

      let jobs = Array.isArray(data.jobs) ? data.jobs : []

      jobs = jobs.map((job, index) => ({
        ...job,
        slug:
          job.slug ||
          `${generateSlug(job.title, job.link)}-${index}`,
        description:
          job.description ||
          job.snippet ||
          "Check job details and apply using the official link.",
      }))

      jobs = dedupeJobs(jobs)

      cachedJobs = jobs
      lastFetchTime = Date.now()
    }

    let jobs = [...cachedJobs]

    /* ================= SLUG DETAIL ================= */

    if (slug) {
      const job = jobs.find((j) => j.slug === slug)

      if (!job) {
        return res.status(404).json({ job: null })
      }

      return res.status(200).json({ job })
    }

    /* ================= CATEGORY FILTER ================= */

    const keywordsMap = {

      ai: [
        "artificial intelligence",
        "machine learning",
        "deep learning",
        "ai engineer",
        "ai developer",
        "ml engineer",
        "nlp"
      ],

      "work-from-home": [
        "work from home",
        "remote job",
        "remote work",
        "wfh",
        "home based",
        "remote"
      ],

      "govt-jobs": [
        "government",
        "govt",
        "sarkari",
        "railway",
        "ssc",
        "upsc",
        "public sector",
        "psu",
        "defence",
        "army",
        "navy",
        "air force"
      ],

      it: [
        "software developer",
        "software engineer",
        "web developer",
        "frontend developer",
        "backend developer",
        "full stack developer",
        "react",
        "node",
        "javascript",
        "python"
      ],

      banking: [
        "bank",
        "banking",
        "loan officer",
        "relationship manager",
        "credit analyst",
        "financial advisor"
      ],

      bpo: [
        "bpo",
        "call center",
        "customer support",
        "customer service",
        "voice process",
        "non voice"
      ],

      sales: [
        "sales",
        "business development",
        "marketing",
        "field sales"
      ],

      engineering: [
        "mechanical engineer",
        "civil engineer",
        "electrical engineer",
        "site engineer",
        "production engineer",
        "design engineer"
      ],

      international: [
        "abroad",
        "overseas",
        "international",
        "gulf",
        "uae",
        "saudi",
        "qatar",
        "canada",
        "usa",
        "uk",
        "remote",
        "work from home"
      ]
    }

    if (category && category !== "all") {

      const cat = category.toLowerCase()

      if (keywordsMap[cat]) {

        const keywords = keywordsMap[cat]

        jobs = jobs.filter((job) => {

          const text = buildText(job, [
            "title",
            "description",
            "snippet",
            "location",
            "company",
          ])

          /* govt jobs only in govt category */

          if (cat !== "govt-jobs" && isGovtJob(text)) {
            return false
          }

          return keywords.some((kw) => text.includes(kw))
        })
      }
    }

    /* ================= SEARCH ================= */

    if (q && q.trim() !== "") {
      const keyword = q.toLowerCase()

      jobs = jobs.filter((job) =>
        buildText(job, [
          "title",
          "description",
          "company",
        ]).includes(keyword)
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