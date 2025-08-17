/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  images: { unoptimized: true },
  eslint: {
    // Speeds up builds on CI by skipping ESLint during `next build`
    ignoreDuringBuilds: true,
  },
  typescript: {
    // Skips type checking during `next build` (CI should handle type checks separately)
    ignoreBuildErrors: true,
  },
};

module.exports = nextConfig;


