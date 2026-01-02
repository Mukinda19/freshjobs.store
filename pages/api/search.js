// pages/api/search.js

export default async function handler(req, res) {
  try {
    const SHEET_URL =
      "https://script.google.com/macros/s/AKfycbyJFzC1seakm3y5BK8d-W7OPSLI1KqE1hXeeVqR_IaCuvbNDsexy8Ey4SY3k-DAL2ta/exec"

    const { category, q, page = 1, limit = 10 } = req.query

    const response = await fetch(`${SHEET_URL}?limit=1000`)
    const data = await response.json()

    let jobs = Array.isArray(data.jobs) ? data.jobs : []

    /* ================= KEYWORDS ================= */

    const aiKeywords = [
      "ai",
      "artificial intelligence",
      "machine learning",
      "ml",
      "deep learning",
      "data scientist",
      "data science",
      "genai",
      "nlp",
      "chatgpt",
      "openai",
    ]

    const wfhKeywords = [
      "work from home",
      "remote",
      "wfh",
      "anywhere",
      "worldwide",
      "work anywhere",
    ]

    const govtKeywords = [
      "government",
      "govt",
      "sarkari",
      "psu",
      "ssc",
      "upsc",
      "railway",
      "defence",
      "police",
    ]

    const indiaKeywords = [
      "india",
      "indian",
      "bharat",
      "new delhi",
      "delhi",
      "mumbai",
      "pune",
      "bangalore",
      "bengaluru",
      "chennai",
      "hyderabad",
      "kolkata",
      "ahmedabad",
      "noida",
      "gurgaon",
    ]

    const normalCategoryMap = {
      "govt-jobs": govtKeywords,
      banking: ["bank", "banking", "ibps", "rbi", "sbi"],
      it: ["software", "developer", "engineer", "programmer"],
      bpo: ["bpo", "call center", "customer support"],
      sales: ["sales", "marketing"],
      engineering: ["mechanical", "civil", "electrical"],
    }

    /* ================= CATEGORY FILTER ================= */

    if (category) {
      const cat = category.toLowerCase()

      /* ✅ AI JOBS */
      if (cat === "ai" || cat === "ai-jobs") {
        jobs = jobs.filter((job) => {
          const text = `
            ${job.title || ""}
            ${job.description || ""}
            ${job.snippet || ""}
            ${job.company || ""}
          `.toLowerCase()

          return aiKeywords.some((kw) => text.includes(kw))
        })
      }

      /* ✅ WORK FROM HOME */
      else if (cat === "work-from-home" || cat === "wfh") {
        jobs = jobs.filter((job) => {
          const text = `
            ${job.title || ""}
            ${job.description || ""}
            ${job.snippet || ""}
            ${job.location || ""}
          `.toLowerCase()

          return wfhKeywords.some((kw) => text.includes(kw))
        })
      }

      /* ✅ INTERNATIONAL JOBS (FINAL FIX ✅) */
      else if (cat === "international" || cat === "international-jobs") {
        jobs = jobs.filter((job) => {
          const text = `
            ${job.title || ""}
            ${job.description || ""}
            ${job.snippet || ""}
            ${job.location || ""}
            ${job.company || ""}
            ${job.source || ""}
          `.toLowerCase()

          const isGovt = govtKeywords.some((kw) => text.includes(kw))
          const isIndia = indiaKeywords.some((kw) => text.includes(kw))

          return !isGovt && !isIndia
        })
      }

      /* ✅ NORMAL CATEGORIES */
      else if (normalCategoryMap[cat]) {
        const keywords = normalCategoryMap[cat]

        jobs = jobs.filter((job) => {
          const text = `
            ${job.title || ""}
            ${job.description || ""}
            ${job.category || ""}
            ${job.company || ""}
          `.toLowerCase()

          return keywords.some((kw) => text.includes(kw))
        })
      }
    }

    /* ================= SEARCH QUERY ================= */

    if (q && q.trim() !== "") {
      const keyword = q.toLowerCase()

      jobs = jobs.filter((job) => {
        const text = `
          ${job.title || ""}
          ${job.description || ""}
          ${job.snippet || ""}
          ${job.company || ""}
        `.toLowerCase()

        return text.includes(keyword)
      })
    }

    /* ================= PAGINATION ================= */

    const pageNum = Number(page)
    const pageLimit = Number(limit)
    const start = (pageNum - 1) * pageLimit
    const end = start + pageLimit

    return res.status(200).json({
      jobs: jobs.slice(start, end),
      total: jobs.length,
      page: pageNum,
      totalPages: Math.ceil(jobs.length / pageLimit),
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