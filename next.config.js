/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [],
  },
  allowedDevOrigins: ["172.20.10.4", "172.20.10.3", "10.38.102.76", "localhost"],
};

module.exports = nextConfig;