/** @type {import('next-sitemap').IConfig} */
const config = {
  siteUrl: "https://freshjobs.store",
  generateRobotsTxt: true,

  sitemapSize: 5000,

  changefreq: "daily",
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
    ];
  },
};

export default config;