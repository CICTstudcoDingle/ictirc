import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    // Support server actions for admin operations
    serverActions: {
      bodySizeLimit: "10mb",
    },
  },
  transpilePackages: [
    "@ictirc/ui",
    "@ictirc/database",
    "@ictirc/storage",
    "@ictirc/email",
  ],
};

export default nextConfig;
