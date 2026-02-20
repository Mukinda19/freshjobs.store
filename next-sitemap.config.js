/** @type {import('next-sitemap').IConfig} */
const config = {
  siteUrl: "https://freshjobs.store",
  generateRobotsTxt: true,

  sitemapSize: 5000,

  changefreq: "daily", // hourly unnecessary hai
  priority: 0.7,

  exclude: [
    "/404",
    "/500",
    "/api/*",
    "/admin/*",
  ],

  robotsTxtOptions: {
    policies: [
      {
        userAgent: "*",
        allow: "/",
      },
    ],
    additionalSitemaps: [
      "https://freshjobs.store/sitemap.xml",
    ],
  },

  additionalPaths: async () => {
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
    ];
  },
};

export default config;