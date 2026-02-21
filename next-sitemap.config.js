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
};

export default config;