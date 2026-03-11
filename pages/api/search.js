let cachedJobs = null
let lastFetchTime = 0

const CACHE_DURATION = 5 * 60 * 1000

import crypto from "crypto"

/* ---------------- SLUG ---------------- */

const generateSlug = (title = "", link = "") => {

  const base = (title || "job-opening")
    .toLowerCase()
    .replace(/<[^>]*>?/gm, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "")

  const hash = crypto
    .createHash("md5")
    .update(link || title)
    .digest("hex")
    .slice(0, 6)

  return `${base}-${hash}`

}

/* ---------------- TEXT BUILDER ---------------- */

const buildText = (job, fields) =>
  fields.map(f => job[f] || "").join(" ").toLowerCase()

/* ---------------- DEDUPE ---------------- */

const dedupeJobs = (jobs) => {

  const seen = new Set()

  return jobs.filter(job => {

    const key = `${job.title}-${job.link}`

    if (seen.has(key)) return false

    seen.add(key)

    return true

  })

}

/* ---------------- CATEGORY CLASSIFIERS ---------------- */

const containsKeyword = (text, keywords) =>
  keywords.some(k => text.includes(k))

/* GOVT */

const isGovtJob = (job) => {

  const text = buildText(job, ["title", "description", "company"])

  const keywords = [
    "government","govt","sarkari",
    "railway","ssc","upsc","psu",
    "defence","army","navy","air force"
  ]

  return containsKeyword(text, keywords)

}

/* WFH */

const isWFHJob = (job) => {

  const text = buildText(job, ["title","description"])

  const keywords = [
    "work from home","remote","wfh",
    "home based","virtual assistant",
    "freelance","remote job"
  ]

  return containsKeyword(text, keywords)

}

/* AI */

const isAIJob = (job) => {

  const text = buildText(job, ["title","description"])

  const keywords = [
    "artificial intelligence",
    "machine learning",
    "deep learning",
    "ai engineer",
    "ml engineer",
    "generative ai",
    "prompt engineer",
    "data scientist"
  ]

  return containsKeyword(text, keywords)

}

/* IT */

const isITJob = (job) => {

  const text = buildText(job, ["title","description"])

  const keywords = [
    "developer","software","programmer",
    "frontend","backend","react",
    "node","python","java",
    "it support","web developer"
  ]

  return containsKeyword(text, keywords)

}

/* BANKING */

const isBankingJob = (job) => {

  const text = buildText(job, ["title","description"])

  const keywords = [
    "bank","banking","loan officer",
    "relationship manager","credit officer",
    "finance executive"
  ]

  return containsKeyword(text, keywords)

}

/* BPO */

const isBPOJob = (job) => {

  const text = buildText(job, ["title","description"])

  const keywords = [
    "bpo","call center","customer support",
    "telecaller","voice process",
    "customer service"
  ]

  return containsKeyword(text, keywords)

}

/* SALES */

const isSalesJob = (job) => {

  const text = buildText(job, ["title","description"])

  const keywords = [
    "sales","sales executive",
    "business development",
    "field sales","marketing executive"
  ]

  return containsKeyword(text, keywords)

}

/* ENGINEERING */

const isEngineeringJob = (job) => {

  const text = buildText(job, ["title","description"])

  const keywords = [
    "engineer","mechanical engineer",
    "civil engineer","electrical engineer",
    "site engineer"
  ]

  return containsKeyword(text, keywords)

}

/* INTERNATIONAL */

const isInternational = (job) => {

  const text = buildText(job, ["title","description","location"])

  const keywords = [
    "abroad","overseas","international",
    "uae","saudi","qatar","oman",
    "kuwait","canada","usa","uk"
  ]

  return containsKeyword(text, keywords)

}

/* ---------------- HANDLER ---------------- */

export default async function handler(req, res) {

  res.setHeader("Cache-Control", "s-maxage=600, stale-while-revalidate")

  try {

    const SHEET_URL = "https://script.google.com/macros/s/AKfycbyJFzC1seakm3y5BK8d-W7OPSLI1KqE1hXeeVqR_IaCuvbNDsexy8Ey4SY3k-DAL2ta/exec"

    const { category, q, slug, location } = req.query

    const page = Math.max(Number(req.query.page) || 1, 1)
    const limit = Math.min(Number(req.query.limit) || 10, 20)

    /* ---------- CACHE ---------- */

    if (!cachedJobs || Date.now() - lastFetchTime > CACHE_DURATION) {

      const response = await fetch(`${SHEET_URL}?limit=1000`)
      const data = await response.json()

      let jobs = Array.isArray(data.jobs) ? data.jobs : []

      jobs = jobs.map(job => ({

        ...job,

        slug: generateSlug(job.title, job.link),

        description:
          job.description ||
          job.snippet ||
          "Check job details and apply using the official link."

      }))

      cachedJobs = dedupeJobs(jobs)

      lastFetchTime = Date.now()

    }

    let jobs = [...cachedJobs]

    /* ---------- JOB DETAIL ---------- */

    if (slug) {

      const job = jobs.find(j => j.slug === slug)

      if (!job) return res.status(404).json({ job: null })

      return res.status(200).json({ job })

    }

    /* ---------- CATEGORY ---------- */

    if (category && category !== "all") {

      const cat = category.toLowerCase()

      if (cat === "govt-jobs") jobs = jobs.filter(isGovtJob)

      else if (cat === "work-from-home")
        jobs = jobs.filter(j => isWFHJob(j) && !isGovtJob(j))

      else if (cat === "ai")
        jobs = jobs.filter(j => isAIJob(j) && !isGovtJob(j))

      else if (cat === "it")
        jobs = jobs.filter(isITJob)

      else if (cat === "banking")
        jobs = jobs.filter(isBankingJob)

      else if (cat === "bpo")
        jobs = jobs.filter(isBPOJob)

      else if (cat === "sales")
        jobs = jobs.filter(isSalesJob)

      else if (cat === "engineering")
        jobs = jobs.filter(isEngineeringJob)

      else if (cat === "international")
        jobs = jobs.filter(isInternational)

    }

    /* ---------- LOCATION FILTER ---------- */

    if (location && location !== "india") {

      const loc = location.toLowerCase()

      jobs = jobs.filter(job =>
        buildText(job, ["location","title","description"]).includes(loc)
      )

    }

    /* ---------- SEARCH ---------- */

    if (q && q.trim()) {

      const keyword = q.toLowerCase()

      jobs = jobs.filter(job =>
        buildText(job, ["title","description","company"])
        .includes(keyword)
      )

    }

    /* ---------- SORT ---------- */

    jobs.sort((a, b) => new Date(b.datePosted) - new Date(a.datePosted))

    /* ---------- PAGINATION ---------- */

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