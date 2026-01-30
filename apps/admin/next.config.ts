import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  transpilePackages: ["@ictirc/ui", "@ictirc/database"],
};

export default nextConfig;
