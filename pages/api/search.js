import crypto from "crypto"

let cachedJobs = null
let lastFetchTime = 0

const CACHE_DURATION = 5 * 60 * 1000

/* ---------------- SLUG ---------------- */

const generateSlug = (title = "", link = "") => {

  const base = (title || "job-opening")
    .toLowerCase()
    .replace(/<[^>]*>?/gm, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "")

  const hash = crypto
    .createHash("md5")
    .update(link || "")
    .digest("hex")
    .slice(0, 8)

  return `${base}-${hash}`
}

/* ---------------- HELPERS ---------------- */

const buildText = (job, fields) =>
  fields.map(f => job[f] || "").join(" ").toLowerCase()

const containsKeyword = (text, keywords) =>
  keywords.some(k => text.includes(k))

const dedupeJobs = jobs => {

  const seen = new Set()

  return jobs.filter(job => {

    const key = `${job.title}-${job.link}`

    if (seen.has(key)) return false

    seen.add(key)

    return true
  })
}

/* ---------------- CATEGORY CHECKS ---------------- */

const isGovtJob = job => {

  const text = buildText(job,["title","description","company"])

  const keywords = [
    "government","govt","sarkari",
    "recruitment","notification",
    "railway","ssc","upsc","psu",
    "defence","army","navy","air force"
  ]

  return containsKeyword(text,keywords)
}

const isWFHJob = job => {

  const text = buildText(job,["title","description","location"])

  const keywords = [
    "work from home","remote","wfh",
    "home based","freelance","anywhere"
  ]

  return containsKeyword(text,keywords)
}

const isAIJob = job => {

  const text = buildText(job,["title","description"])

  const keywords = [
    "artificial intelligence",
    "machine learning",
    "deep learning",
    "ai engineer",
    "ml engineer",
    "generative ai",
    "prompt engineer"
  ]

  return containsKeyword(text,keywords)
}

const isITJob = job => {

  const text = buildText(job,["title","description"])

  const keywords = [
    "developer","software",
    "programmer","frontend",
    "backend","react",
    "node","java","python"
  ]

  return containsKeyword(text,keywords)
}

const isBankingJob = job => {

  const text = buildText(job,["title","description"])

  return containsKeyword(text,["bank","banking"])
}

const isBPOJob = job => {

  const text = buildText(job,["title","description"])

  return containsKeyword(text,[
    "bpo","call center",
    "customer support","telecaller"
  ])
}

const isSalesJob = job => {

  const text = buildText(job,["title","description"])

  return containsKeyword(text,[
    "sales","business development",
    "field sales"
  ])
}

const isEngineeringJob = job => {

  const text = buildText(job,["title","description"])

  return containsKeyword(text,[
    "engineer",
    "mechanical engineer",
    "civil engineer",
    "electrical engineer"
  ])
}

const isInternational = job => {

  const text = buildText(job,["title","description","location"])

  return containsKeyword(text,[
    "abroad","overseas",
    "uae","saudi","qatar",
    "oman","kuwait",
    "canada","usa","uk",
    "remote worldwide"
  ])
}

/* ---------------- API ---------------- */

export default async function handler(req,res){

  res.setHeader(
    "Cache-Control",
    "s-maxage=600, stale-while-revalidate"
  )

  try{

    const SHEET_URL =
      "https://script.google.com/macros/s/AKfycbyJFzC1seakm3y5BK8d-W7OPSLI1KqE1hXeeVqR_IaCuvbNDsexy8Ey4SY3k-DAL2ta/exec"

    const { category,q,slug,location } = req.query

    const page = Math.max(Number(req.query.page)||1,1)
    const limit = Math.min(Number(req.query.limit)||10,20)

    /* -------- FETCH DATA -------- */

    if(!cachedJobs || Date.now()-lastFetchTime > CACHE_DURATION){

      const response = await fetch(`${SHEET_URL}?limit=800`)
      const data = await response.json()

      let jobs = []

      if(Array.isArray(data)) jobs = data
      else if(Array.isArray(data.jobs)) jobs = data.jobs
      else if(Array.isArray(data.data)) jobs = data.data

      jobs = jobs.map(job => ({

        ...job,

        slug:generateSlug(job.title,job.link),

        description:
          job.description ||
          job.snippet ||
          "Click to view full job details.",

        datePosted:
          job.datePosted ||
          job.pubDate ||
          new Date().toISOString(),

        validThrough:new Date(
          Date.now()+30*24*60*60*1000
        ).toISOString()

      }))

      cachedJobs = dedupeJobs(jobs)
      lastFetchTime = Date.now()
    }

    let jobs=[...cachedJobs]

    /* -------- DETAIL PAGE -------- */

    if(slug){

      const job=jobs.find(j=>j.slug===slug)

      if(!job) return res.status(404).json({job:null})

      return res.status(200).json({job})
    }

    /* -------- CATEGORY FILTER -------- */

    if(category && category!=="all"){

      const cat=category.toLowerCase()

      if(cat==="govt-jobs") jobs=jobs.filter(isGovtJob)

      else if(cat==="work-from-home")
        jobs=jobs.filter(j=>isWFHJob(j) && !isGovtJob(j))

      else if(cat==="ai-jobs")
        jobs=jobs.filter(j=>isAIJob(j) && !isGovtJob(j))

      else if(cat==="it")
        jobs=jobs.filter(j=>isITJob(j) && !isGovtJob(j))

      else if(cat==="banking")
        jobs=jobs.filter(isBankingJob)

      else if(cat==="bpo")
        jobs=jobs.filter(isBPOJob)

      else if(cat==="sales")
        jobs=jobs.filter(isSalesJob)

      else if(cat==="engineering")
        jobs=jobs.filter(isEngineeringJob)

      else if(cat==="international")
        jobs=jobs.filter(isInternational)
    }

    /* -------- LOCATION FILTER -------- */

    if(
      location &&
      location!=="india" &&
      category!=="work-from-home" &&
      category!=="ai-jobs"
    ){

      const loc=location.toLowerCase()

      jobs=jobs.filter(job =>
        buildText(job,["location","title","description"]).includes(loc)
      )
    }

    /* -------- SEARCH -------- */

    if(q && q.trim()){

      const keyword=q.toLowerCase()

      jobs=jobs.filter(job =>
        buildText(job,["title","description","company"]).includes(keyword)
      )
    }

    /* -------- SORT -------- */

    jobs.sort((a,b)=>new Date(b.datePosted)-new Date(a.datePosted))

    /* -------- PAGINATION -------- */

    const start=(page-1)*limit
    const totalPages=Math.max(Math.ceil(jobs.length/limit),1)

    return res.status(200).json({

      jobs:jobs.slice(start,start+limit),
      total:jobs.length,
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