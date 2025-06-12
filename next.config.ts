import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true, // ← ✅ THIS disables Vercel ESLint checks
  },
};

export default nextConfig;
