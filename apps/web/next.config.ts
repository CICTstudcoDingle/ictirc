import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    // Enable Partial Prerendering when stable
    // ppr: true,

    // Support large file uploads (50MB) for manuscript submissions
    serverActions: {
      bodySizeLimit: "50mb",
    },
  },
  output: "standalone",
  transpilePackages: [
    "@ictirc/ui",
    "@ictirc/database",
    "@ictirc/seo",
    "@ictirc/email",
  ],
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "lydwljxqxjucpixkyjzp.supabase.co",
        pathname: "/storage/v1/object/public/**",
      },
    ],
  },
};

export default nextConfig;
