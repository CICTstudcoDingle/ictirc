import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  transpilePackages: [
    "@ictirc/ui",
    "@ictirc/database",
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
