/** @type {import('next-sitemap').IConfig} */

const BASE_URL = "https://freshjobs.store"

const config = {
  siteUrl: BASE_URL,
  generateRobotsTxt: true,
  sitemapSize: 5000,
  changefreq: "daily",
  priority: 0.7,

  exclude: ["/404", "/500", "/api/*", "/admin/*"],

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
      const res = await fetch(
        `${BASE_URL}/api/search?page=1&limit=1000`
      )
      const data = await res.json()

      const jobPaths =
        data.jobs?.map((job) => ({
          loc: `/job/${job.slug}`,
          changefreq: "daily",
          priority: 0.8,
        })) || []

      return [
        {
          loc: "/ai-jobs",
          changefreq: "daily",
          priority: 0.9,
        },
        {
          loc: "/work-from-home",
          changefreq: "daily",
          priority: 0.9,
        },
        {
          loc: "/international-jobs",
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