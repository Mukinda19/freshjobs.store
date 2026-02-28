/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,

  images: {
    domains: ["via.placeholder.com"],
  },

  trailingSlash: true,

  async redirects() {
    return [
      // ✅ Redirect old /job URLs to /jobs (FIX 404 ISSUE)
      {
        source: "/job/:slug*",
        destination: "/jobs/:slug*",
        permanent: true, // 301 redirect
      },

      // ✅ FORCE REDIRECT: vercel.app → freshjobs.store
      {
        source: "/:path*",
        has: [
          {
            type: "host",
            value: "freshjobs-store.vercel.app",
          },
        ],
        destination: "https://freshjobs.store/:path*",
        permanent: true, // 301 redirect
      },
    ];
  },
};

export default nextConfig;