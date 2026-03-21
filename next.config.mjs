/** @type {import('next').NextConfig} */

const nextConfig = {
  reactStrictMode: true,

  images: {
    domains: ["via.placeholder.com"],
  },

  // ❌ REMOVE THIS (loop ka main reason)
  // trailingSlash: true,

  async redirects() {
    return [

      /* ✅ OLD jobs URL fix */
      {
        source: "/jobs/:slug",
        destination: "/job/:slug",
        permanent: true,
      },

      /* ❌ REMOVE THIS (loop create kar raha hai) */
      // {
      //   source: '/job/:slug/',
      //   destination: '/job/:slug',
      //   permanent: true,
      // },

      /* ✅ Non-www → www */
      {
        source: "/:path*",
        has: [
          {
            type: "host",
            value: "freshjobs.store",
          },
        ],
        destination: "https://www.freshjobs.store/:path*",
        permanent: true,
      },

      /* ✅ Vercel domain → main domain */
      {
        source: "/:path*",
        has: [
          {
            type: "host",
            value: "freshjobs-store.vercel.app",
          },
        ],
        destination: "https://www.freshjobs.store/:path*",
        permanent: true,
      },

    ];
  },

  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          { key: "X-Frame-Options", value: "SAMEORIGIN" },
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          { key: "X-XSS-Protection", value: "1; mode=block" },
        ],
      },
    ];
  },
};

export default nextConfig;