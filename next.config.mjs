/** @type {import('next').NextConfig} */

const nextConfig = {
  reactStrictMode: true,

  images: {
    domains: ["via.placeholder.com"],
  },

  trailingSlash: true,

  async redirects() {
    return [
      /* ✅ Redirect OLD job URLs → NEW job URLs */

      {
        source: "/jobs/:slug",
        destination: "/job/:slug",
        permanent: true,
      },

      /* ✅ Force NON-WWW → WWW (SEO Canonical Fix) */

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

      /* ✅ Redirect Vercel Domain → Main Domain */

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
          {
            key: "X-Frame-Options",
            value: "SAMEORIGIN",
          },

          {
            key: "X-Content-Type-Options",
            value: "nosniff",
          },

          {
            key: "Referrer-Policy",
            value: "strict-origin-when-cross-origin",
          },

          {
            key: "X-XSS-Protection",
            value: "1; mode=block",
          },
        ],
      },
    ];
  },
};

export default nextConfig;