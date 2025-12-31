/** @type {import('next-sitemap').IConfig} */
const config = {
  siteUrl: "https://freshjobs.store",
  generateRobotsTxt: true,
  sitemapSize: 5000,

  exclude: [
    "/404",
    "/500",
    "/api/*",
  ],

  changefreq: "hourly",
  priority: 0.7,

  robotsTxtOptions: {
    policies: [
      {
        userAgent: "*",
        allow: "/",
      },
    ],
  },

  additionalPaths: async () => {
    return [
      {
        loc: "/ai-jobs",
        changefreq: "hourly",
        priority: 0.9,
      },
      {
        loc: "/work-from-home",
        changefreq: "hourly",
        priority: 0.9,
      },
    ]
  },
}

export default config