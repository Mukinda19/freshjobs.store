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
const buildText = (job, fields) =>
  fields.map((f) => job[f] || "").join(" ").toLowerCase()

/* ---------------- REMOVE DUPLICATES ---------------- */
const dedupeJobs = (jobs) => {
  const seen = new Set()

  return jobs.filter((job) => {
    const key = `${job.title}-${job.link}`
    if (seen.has(key)) return false
    seen.add(key)
    return true
  })
}

/* ---------------- GOVT CHECK ---------------- */
const isGovtJob = (text) => {
  const govtKeywords = [
    "government","govt","sarkari","railway","ssc","upsc",
    "public sector","psu","defence","army","navy","air force",
    "bank recruitment","state government","central government"
  ]

  return govtKeywords.some((kw) => text.includes(kw))
}

/* ---------------- WFH SOURCE CHECK ---------------- */
const isWFHSource = (source = "") => {
  const wfhSources = [
    "RemoteOK",
    "WeWorkRemotely",
    "Remotive",
    "Jobicy"
  ]

  return wfhSources.includes(source)
}

/* ---------------- KEYWORDS MAP ---------------- */
const keywordsMap = {

  ai: [
    "artificial intelligence","machine learning","deep learning",
    "ai engineer","ai developer","ml engineer","nlp engineer",
    "ai research","computer vision","generative ai","prompt engineer"
  ],

  "work-from-home": [
    "work from home","remote job","remote work","wfh",
    "home based","online job","freelance","virtual assistant",
    "remote support","remote customer service","data entry remote"
  ],

  "govt-jobs": [
    "government","govt","sarkari","railway","ssc","upsc",
    "public sector","psu","defence","army","navy","air force"
  ],

  international: [
    "abroad","overseas","international","gulf",
    "uae","saudi","qatar","oman","kuwait",
    "canada","usa","uk","australia","europe"
  ]
}

/* ---------------- API HANDLER ---------------- */
export default async function handler(req, res) {

  res.setHeader("Cache-Control", "s-maxage=600, stale-while-revalidate")

  try {

    const SHEET_URL =
      "https://script.google.com/macros/s/AKfycbyJFzC1seakm3y5BK8d-W7OPSLI1KqE1hXeeVqR_IaCuvbNDsexy8Ey4SY3k-DAL2ta/exec"

    const { category, q, slug } = req.query
    const page = Math.max(Number(req.query.page) || 1, 1)
    const limit = Math.min(Number(req.query.limit) || 10, 20)

    /* ================= CACHE ================= */

    if (!cachedJobs || Date.now() - lastFetchTime > CACHE_DURATION) {

      const response = await fetch(`${SHEET_URL}?limit=1000`)
      const data = await response.json()

      let jobs = Array.isArray(data.jobs) ? data.jobs : []

      jobs = jobs.map((job, index) => ({
        ...job,
        slug: job.slug || `${generateSlug(job.title, job.link)}-${index}`,
        description:
          job.description ||
          job.snippet ||
          "Check job details and apply using the official link."
      }))

      jobs = dedupeJobs(jobs)

      cachedJobs = jobs
      lastFetchTime = Date.now()
    }

    let jobs = [...cachedJobs]

    /* ================= JOB DETAIL ================= */

    if (slug) {

      const job = jobs.find((j) => j.slug === slug)

      if (!job) return res.status(404).json({ job: null })

      return res.status(200).json({ job })
    }

    /* ================= CATEGORY FILTER ================= */

    if (category && category !== "all") {

      const cat = category.toLowerCase()

      if (cat === "govt-jobs") {

        jobs = jobs.filter((job) => {
          const text = buildText(job, ["title","description","company"])
          return isGovtJob(text)
        })

      }

      else if (cat === "work-from-home") {

        jobs = jobs.filter((job) => {

          const text = buildText(job, ["title","description","company"])

          return (
            isWFHSource(job.source) ||
            keywordsMap["work-from-home"].some((kw) => text.includes(kw))
          ) && !isGovtJob(text)

        })

      }

      else if (cat === "ai") {

        jobs = jobs.filter((job) => {

          const text = buildText(job, ["title","description","company"])

          return (
            keywordsMap.ai.some((kw) => text.includes(kw))
          ) && !isGovtJob(text)

        })

      }

      else if (cat === "international") {

        jobs = jobs.filter((job) => {

          const text = buildText(job, ["title","description","location"])

          return (
            keywordsMap.international.some((kw) => text.includes(kw)) ||
            isWFHSource(job.source)
          )

        })

      }
    }

    /* ================= SEARCH ================= */

    if (q && q.trim() !== "") {

      const keyword = q.toLowerCase()

      jobs = jobs.filter((job) =>
        buildText(job, ["title","description","company"]).includes(keyword)
      )
    }

    /* ================= SORT ================= */

    jobs.sort((a, b) => new Date(b.datePosted) - new Date(a.datePosted))

    /* ================= PAGINATION ================= */

    const start = (page - 1) * limit
    const totalPages = Math.ceil(jobs.length / limit)

    return res.status(200).json({
      jobs: jobs.slice(start, start + limit),
      total: jobs.length,
      page,
      totalPages
    })

  }

  catch (err) {

    console.error("API error:", err)

    return res.status(500).json({
      jobs: [],
      total: 0,
      page: 1,
      totalPages: 1
    })
  }
}