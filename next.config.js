/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: ['api.fontshare.com', 'images.unsplash.com'],
  },
  transpilePackages: ['three'],
};

module.exports = nextConfig;
