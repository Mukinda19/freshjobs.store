/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,

  images: {
    domains: ["via.placeholder.com"],
  },

  trailingSlash: true,

  // ✅ FORCE REDIRECT: vercel.app → freshjobs.store
  async redirects() {
    return [
      {
        source: "/:path*",
        has: [
          {
            type: "host",
            value: "freshjobs-store.vercel.app",
          },
        ],
        destination: "https://freshjobs.store/:path*",
        permanent: true, // 301 redirect (SEO best practice)
      },
    ];
  },
};

export default nextConfig;