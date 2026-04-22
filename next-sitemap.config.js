/** @type {import('next-sitemap').IConfig} */

const BASE_URL = "https://www.freshjobs.store"

const JOB_TITLES = [
  "software-developer",
  "java-developer",
  "python-developer",
  "full-stack-developer",
  "web-developer",
  "frontend-developer",
  "backend-developer",
  "data-entry",
  "work-from-home",
  "remote",
  "digital-marketing",
  "graphic-designer",
  "hr",
  "accountant",
  "back-office",
  "computer-operator",
  "customer-support",
  "call-center",
  "project-manager",
  "business-analyst",
  "data-analyst",
  "mechanical-engineer",
  "civil-engineer"
]

const CITY_PAGES = [
  "mumbai",
  "delhi",
  "pune",
  "bangalore",
  "hyderabad",
  "chennai",
  "kolkata",
  "ahmedabad",
  "noida",
  "gurgaon"
]

const STATIC_PAGES = [
  "/",
  "/work-from-home",
  "/high-paying-wfh",
  "/ai-jobs",
  "/worldwide-jobs",
  "/government-jobs",
  "/free-job-alert",
  "/private-jobs",
  "/freshers-jobs",
  "/epfo-jobs"
]

const config = {
  siteUrl: BASE_URL,
  generateRobotsTxt: true,
  sitemapSize: 5000,

  changefreq: "daily",
  priority: 0.7,

  exclude: [
    "/404",
    "/500",
    "/api/*",
    "/admin/*",
    "/**/page/*",
  ],

  robotsTxtOptions: {
    policies: [
      { userAgent: "*", allow: "/" }
    ],

    additionalSitemaps: [
      `${BASE_URL}/sitemap-pages.xml`,
      `${BASE_URL}/sitemap-categories.xml`,
    ],
  },

  additionalPaths: async () => {

    try {

      const res = await fetch(
        `${BASE_URL}/api/search?limit=5000`
      )

      const data = await res.json()

      const jobPaths =
        data.jobs?.map((job) => ({
          loc: `/job/${job.slug}`,
          changefreq: "daily",
          priority: 0.9,
          lastmod: new Date().toISOString(),
        })) || []

      const titlePaths = JOB_TITLES.map((title) => ({
        loc: `/jobs/title/${title}`,
        changefreq: "daily",
        priority: 0.8,
        lastmod: new Date().toISOString(),
      }))

      const cityPaths = CITY_PAGES.map((city) => ({
        loc: `/jobs/all/${city}`,
        changefreq: "daily",
        priority: 0.8,
        lastmod: new Date().toISOString(),
      }))

      const staticPaths = STATIC_PAGES.map((page) => ({
        loc: page,
        changefreq: "daily",
        priority: page === "/" ? 1.0 : 0.9,
        lastmod: new Date().toISOString(),
      }))

      return [
        ...staticPaths,
        ...jobPaths,
        ...titlePaths,
        ...cityPaths
      ]

    } catch (e) {

      console.error("Sitemap Error:", e)
      return []

    }

  },
}

export default config