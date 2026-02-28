/** @type {import('next-sitemap').IConfig} */

const BASE_URL = "https://www.freshjobs.store"

const config = {
  siteUrl: BASE_URL,
  generateRobotsTxt: true,

  sitemapSize: 5000, // auto split after 5000 URLs

  changefreq: "daily",
  priority: 0.7,

  exclude: [
    "/404",
    "/500",
    "/api/*",
    "/admin/*",
    "/**/page/*", // exclude pagination
  ],

  robotsTxtOptions: {
    policies: [
      {
        userAgent: "*",
        allow: "/",
      },
    ],

    // 🔥 ADD THIS
    additionalSitemaps: [
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
          loc: `/jobs/${job.slug}`,
          changefreq: "daily",
          priority: 0.8,
        })) || []

      return jobPaths
    } catch (e) {
      console.error("Sitemap Job Fetch Error:", e)
      return []
    }
  },
}

export default config