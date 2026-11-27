/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    // Allow local images from /public — no remotePatterns needed
    // External images from old site are now downloaded locally
  },
};

export default nextConfig;
