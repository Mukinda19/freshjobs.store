/** @type {import('next-sitemap').IConfig} */
module.exports = {
  siteUrl: "https://freshjobs.store",

  generateRobotsTxt: true,
  sitemapSize: 5000,

  // 🔒 Exclude non-SEO URLs
  exclude: [
    "/404",
    "/500",
    "/api/*",
    "/_next/*",
    "/admin/*",
  ],

  // 🤖 Robots.txt rules
  robotsTxtOptions: {
    policies: [
      {
        userAgent: "*",
        allow: "/",
      },
    ],
  },

  // 🌍 Default SEO values
  changefreq: "daily",
  priority: 0.7,

  // ⭐ Important static pages (manual boost)
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
      {
        loc: "/international-jobs",
        changefreq: "daily",
        priority: 0.8,
      },
    ]
  },
}