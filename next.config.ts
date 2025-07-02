import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    domains: ["red-tough-takin-185.mypinata.cloud"],
    remotePatterns: [
      {
        protocol: "https",
        hostname: "avatars.githubusercontent.com",
      },
      {
        protocol: "https",
        hostname: "img.clerk.com",
      },
      {
        protocol: "https",
        hostname: "red-tough-takin-185.mypinata.cloud",
        port: "",
        pathname: "/files/**",
      },
    ],
  },
  experimental: {
    serverActions: {
      bodySizeLimit: "1gb",
    },
  },
  devIndicators: false,
};

export default nextConfig;
