




/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },

  // REQUIRED for static hosting (Next.js 13–15 App Router)
  output: 'export',
};

export default nextConfig;
