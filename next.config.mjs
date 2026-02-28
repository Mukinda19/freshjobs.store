/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,

  images: {
    domains: ["via.placeholder.com"],
  },

  trailingSlash: true,

  async redirects() {
    return [
      // ✅ Redirect wrong /jobs URLs to correct /job route
      {
        source: "/jobs/:slug*",
        destination: "/job/:slug*",
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