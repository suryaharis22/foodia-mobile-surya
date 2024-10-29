/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ["api-foodia-staging.cmtdepok.xyz"],
  },
  reactStrictMode: true,
  devIndicators: {
    buildActivity: false,
  },
};

module.exports = nextConfig;
