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
    "/**/page/*",
  ],

  robotsTxtOptions: {
    policies: [
      {
        userAgent: "*",
        allow: "/",
      },
      {
        userAgent: "Googlebot",
        allow: "/",
      },
      {
        userAgent: "Googlebot-News",
        allow: "/",
      },
    ],

    additionalSitemaps: [
      `${BASE_URL}/sitemap.xml`,
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
          loc: `/job/${job.slug}`, // ✅ FIXED PATH
          changefreq: "daily",
          priority: 0.9,
          lastmod: new Date().toISOString(),
        })) || []

      return jobPaths
    } catch (e) {
      console.error("Sitemap Job Fetch Error:", e)
      return []
    }
  },
}

export default config