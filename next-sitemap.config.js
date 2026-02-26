/** @type {import('next-sitemap').IConfig} */

const BASE_URL = "https://www.freshjobs.store"

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
    "/**/page/*", // ❌ exclude pagination
  ],

  robotsTxtOptions: {
    policies: [
      {
        userAgent: "*",
        allow: "/",
      },
    ],
  },

  additionalPaths: async () => {
    try {
      /* 🔥 Fetch All Jobs (increase limit safely) */
      const res = await fetch(
        `${BASE_URL}/api/search?limit=5000`
      )

      const data = await res.json()

      const jobPaths =
        data.jobs?.map((job) => ({
          loc: `/jobs/${job.slug}`, // ✅ fixed path
          changefreq: "daily",
          priority: 0.8,
        })) || []

      return [
        /* 🔥 Core Category Pages */
        {
          loc: "/government-jobs",
          changefreq: "daily",
          priority: 0.95,
        },
        {
          loc: "/work-from-home",
          changefreq: "daily",
          priority: 0.95,
        },
        {
          loc: "/high-paying-wfh",
          changefreq: "daily",
          priority: 0.9,
        },
        {
          loc: "/international-jobs",
          changefreq: "daily",
          priority: 0.9,
        },
        {
          loc: "/ai-jobs",
          changefreq: "daily",
          priority: 0.9,
        },
        {
          loc: "/resume-builder",
          changefreq: "weekly",
          priority: 0.8,
        },

        ...jobPaths,
      ]
    } catch (e) {
      console.error("Sitemap Job Fetch Error:", e)
      return []
    }
  },
}

export default config