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

const isGovtJob = (job) => {

  const category = (job.category || "").toLowerCase()

  if (
    category === "govt" ||
    category === "govt-jobs" ||
    category === "government"
  ) return true

  const text = buildText(job, ["title","description","company"])

  const keywords = [
    "government","govt","sarkari",
    "railway","ssc","upsc","psu",
    "defence","army","navy","air force",
    "bank recruitment"
  ]

  return keywords.some((k)=>text.includes(k))

}

/* ---------------- WFH CHECK ---------------- */

const isWFHJob = (job) => {

  const category = (job.category || "").toLowerCase()

  if (
    category === "work-from-home" ||
    category === "workfromhome" ||
    category === "wfh"
  ) return true

  const text = buildText(job, ["title","description"])

  const keywords = [
    "remote",
    "work from home",
    "wfh",
    "home based",
    "virtual assistant",
    "freelance"
  ]

  return keywords.some((k)=>text.includes(k))

}

/* ---------------- AI CHECK (SAFE) ---------------- */

const isAIJob = (job) => {

  const text = buildText(job, ["title","description"])

  const keywords = [
    "artificial intelligence",
    "machine learning",
    "deep learning",
    "ai engineer",
    "ml engineer",
    "computer vision",
    "generative ai",
    "prompt engineer",
    "data scientist",
    "nlp engineer"
  ]

  return keywords.some((k)=>text.includes(k))

}

/* ---------------- INTERNATIONAL ---------------- */

const isInternational = (job) => {

  const text = buildText(job, ["title","description","location"])

  const keywords = [
    "abroad","overseas","international",
    "uae","saudi","qatar","oman",
    "kuwait","canada","usa","uk",
    "australia","europe"
  ]

  return keywords.some((k)=>text.includes(k))

}

/* ---------------- API HANDLER ---------------- */

export default async function handler(req, res) {

  res.setHeader("Cache-Control","s-maxage=600, stale-while-revalidate")

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

      cachedJobs = dedupeJobs(jobs)
      lastFetchTime = Date.now()

    }

    let jobs = [...cachedJobs]

    /* ================= JOB DETAIL ================= */

    if (slug) {

      const job = jobs.find((j)=>j.slug === slug)

      if (!job) return res.status(404).json({ job:null })

      return res.status(200).json({ job })

    }

    /* ================= CATEGORY FILTER ================= */

    if (category && category !== "all") {

      const cat = category.toLowerCase()

      if (cat === "govt-jobs") {
        jobs = jobs.filter(isGovtJob)
      }

      else if (cat === "work-from-home") {
        jobs = jobs.filter(j => isWFHJob(j) && !isGovtJob(j))
      }

      else if (cat === "ai") {
        jobs = jobs.filter(j => isAIJob(j) && !isGovtJob(j))
      }

      else if (cat === "international") {
        jobs = jobs.filter(isInternational)
      }

    }

    /* ================= SEARCH ================= */

    if (q && q.trim()) {

      const keyword = q.toLowerCase()

      jobs = jobs.filter((job)=>
        buildText(job,["title","description","company"]).includes(keyword)
      )

    }

    /* ================= SORT ================= */

    jobs.sort((a,b)=>new Date(b.datePosted)-new Date(a.datePosted))

    /* ================= PAGINATION ================= */

    const start = (page-1)*limit
    const totalPages = Math.ceil(jobs.length/limit)

    return res.status(200).json({

      jobs: jobs.slice(start,start+limit),
      total: jobs.length,
      page,
      totalPages

    })

  }

  catch(err){

    console.error("API error:",err)

    return res.status(500).json({

      jobs:[],
      total:0,
      page:1,
      totalPages:1

    })

  }

}