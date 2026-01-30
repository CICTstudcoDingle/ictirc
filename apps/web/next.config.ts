import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    // Enable Partial Prerendering when stable
    // ppr: true,
  },
  output: "standalone",
  transpilePackages: [
    "@ictirc/ui",
    "@ictirc/database",
    "@ictirc/seo",
    "@ictirc/email",
  ],
};

export default nextConfig;
