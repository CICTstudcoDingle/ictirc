import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    serverActions: {
      bodySizeLimit: "5mb",
    },
  },
  transpilePackages: ["@ictirc/database"],
};

export default nextConfig;
