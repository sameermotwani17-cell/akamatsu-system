import type { NextConfig } from "next";

// next-intl plugin — points to our request config
// eslint-disable-next-line @typescript-eslint/no-require-imports
const withNextIntl = require("next-intl/plugin")("./lib/i18n/request.ts");

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "*.supabase.co",
        pathname: "/storage/v1/object/public/**",
      },
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
    ],
    formats: ["image/avif", "image/webp"],
  },
  experimental: {
    optimizePackageImports: ["lucide-react"],
  },
  turbopack: {
    root: __dirname,
  },
};

export default withNextIntl(nextConfig);
