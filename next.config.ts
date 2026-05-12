import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /** LAN / tunnel hosts that may load the app in dev (HMR, dev-only assets). */
  allowedDevOrigins: ["10.5.0.2"],
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "static.wixstatic.com",
        pathname: "/**",
      },
    ],
  },
};

export default nextConfig;
