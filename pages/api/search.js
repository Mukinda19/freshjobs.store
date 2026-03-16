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
    "work from home",
    "remote job",
    "remote work",
    "remote position",
    "remote opportunity",
    "wfh",
    "freelance",
    "work remotely",
    "remote anywhere"
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
    "prompt engineer",
    "chatgpt",
    "llm engineer"
  ]

  return containsKeyword(text,keywords)
}

/* ---------------- IT JOBS ---------------- */

const isITJob = job => {

  const text = buildText(job,["title","description"])

  const keywords = [

    "developer","software","programmer",
    "software developer","software engineer",
    "application developer",

    "frontend","frontend developer",
    "backend","backend developer",
    "full stack","full stack developer",

    "web developer","website developer",

    "react","reactjs","angular","vue","vuejs",
    "node","nodejs","expressjs",

    "java","python","php",".net","dotnet",
    "spring","spring boot",

    "android developer","ios developer",
    "mobile developer","app developer",

    "data analyst","data scientist",
    "data engineer","big data",

    "devops","devops engineer",

    "cloud","cloud engineer",
    "aws","azure","gcp",

    "system administrator",
    "network engineer",
    "it support",
    "technical support",

    "database administrator","dba",
    "sql developer",

    "qa engineer","test engineer",
    "software tester","qa tester",

    "ui developer","ui designer",
    "ux designer",

    "cyber security","information security",
    "penetration tester",

    "wordpress developer",
    "shopify developer",
    "web designer"
  ]

  return containsKeyword(text,keywords)
}

/* ---------------- BANKING ---------------- */

const isBankingJob = job => {

  const text = buildText(job,["title","description"])

  return containsKeyword(text,[
    "bank","banking","loan officer",
    "credit officer","relationship manager",
    "branch manager","financial advisor",
    "bank clerk","probationary officer"
  ])
}

/* ---------------- BPO ---------------- */

const isBPOJob = job => {

  const text = buildText(job,["title","description"])

  return containsKeyword(text,[

    "bpo","call center","call centre",
    "customer support","customer service",
    "customer care",

    "telecaller","telesales",
    "tele calling","tele calling executive",

    "voice process","non voice process",

    "chat support","email support",
    "process associate",

    "customer success",
    "support executive",
    "customer executive",

    "inbound process","outbound process",

    "call centre executive",
    "customer representative",

    "international voice process",
    "domestic voice process"

  ])
}

/* ---------------- SALES ---------------- */

const isSalesJob = job => {

  const text = buildText(job,["title","description"])

  return containsKeyword(text,[

    "sales","sales executive",
    "sales officer",

    "sales manager",
    "senior sales executive",

    "business development",
    "business development executive",
    "business development manager",

    "bde","bdm",

    "field sales","field sales executive",

    "inside sales",
    "direct sales",

    "territory sales",

    "area sales manager",

    "relationship manager",

    "account manager",
    "key account manager",

    "channel sales",

    "client acquisition",

    "marketing executive",
    "marketing manager",

    "pre sales",
    "sales consultant"

  ])
}

/* ---------------- ENGINEERING ---------------- */

const isEngineeringJob = job => {

  const text = buildText(job,["title","description"])

  return containsKeyword(text,[

    "engineer",
    "mechanical engineer",
    "civil engineer",
    "electrical engineer",
    "electronics engineer",
    "site engineer",
    "production engineer",
    "maintenance engineer",
    "quality engineer",
    "design engineer",
    "project engineer",
    "industrial engineer",
    "automation engineer",
    "manufacturing engineer",
    "plant engineer",
    "service engineer",
    "field engineer"

  ])
}

/* ---------------- INTERNATIONAL ---------------- */

const isInternational = job => {

  const text = buildText(job,["title","description","location","company"])

  return containsKeyword(text,[

    "abroad","overseas",
    "uae","dubai","abu dhabi",
    "saudi","qatar","oman",
    "kuwait","bahrain",

    "canada","usa","united states",
    "uk","united kingdom",
    "australia","singapore",

    "europe","germany","france",
    "netherlands","ireland",

    "remote worldwide",
    "worldwide remote",
    "global remote",

    "global company",
    "global hiring",
    "international hiring",

    "work from anywhere",
    "anywhere in the world",
    "hiring worldwide",

    "remote europe",
    "remote us",
    "remote usa",
    "remote uk",
    "remote canada",

    "global opportunity",
    "open worldwide",
    "distributed team"
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

    const { category,q,slug,location,title } = req.query

    const page = Math.max(parseInt(req.query.page) || 1,1)
    const limit = Math.max(Math.min(parseInt(req.query.limit) || 10,20),1)

    if(!cachedJobs || Date.now()-lastFetchTime > CACHE_DURATION){

      const response = await fetch(`${SHEET_URL}?limit=1500`)
      const data = await response.json()

      let jobs = []

      if(Array.isArray(data)) jobs = data
      else if(Array.isArray(data.jobs)) jobs = data.jobs
      else if(Array.isArray(data.data)) jobs = data.data

      jobs = jobs.map(job => ({
        ...job,
        slug:generateSlug(job.title,job.link),
        description: job.description || job.snippet || "Click to view full job details.",
        datePosted: job.datePosted || job.pubDate || new Date().toISOString(),
        validThrough:new Date(Date.now()+30*24*60*60*1000).toISOString()
      }))

      cachedJobs = dedupeJobs(jobs)
      lastFetchTime = Date.now()
    }

    let jobs=[...cachedJobs]

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
        jobs=jobs.filter(j => isITJob(j) && !isInternational(j))

      else if(cat==="banking")
        jobs=jobs.filter(j => isBankingJob(j) && !isInternational(j))

      else if(cat==="bpo")
        jobs=jobs.filter(j => isBPOJob(j) && !isInternational(j))

      else if(cat==="sales")
        jobs=jobs.filter(j => isSalesJob(j) && !isInternational(j))

      else if(cat==="engineering")
        jobs=jobs.filter(j => isEngineeringJob(j) && !isInternational(j))

      else if(cat==="international")
        jobs=jobs.filter(isInternational)
    }

    /* -------- LOCATION FILTER -------- */

    if(
      location &&
      category!=="work-from-home" &&
      category!=="ai-jobs" &&
      category!=="international"
    ){

      const loc = location.toLowerCase()

      jobs = jobs.filter(job =>
        buildText(job,["location","title","description"]).includes(loc)
      )
    }

    /* -------- TITLE FILTER -------- */

    if(title){

      const keyword = title.toLowerCase().replace(/-/g," ")

      jobs = jobs.filter(job =>
        buildText(job,["title","description"]).includes(keyword)
      )
    }

    if(q && q.trim()){

      const keyword=q.toLowerCase()

      jobs=jobs.filter(job =>
        buildText(job,["title","description","company"]).includes(keyword)
      )
    }

    jobs.sort((a,b)=>new Date(b.datePosted)-new Date(a.datePosted))

    const total = jobs.length
    const totalPages = Math.max(Math.ceil(total/limit),1)

    const safePage = page > totalPages ? totalPages : page

    const start=(safePage-1)*limit
    const end=start+limit

    return res.status(200).json({
      jobs:jobs.slice(start,end),
      total,
      page:safePage,
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