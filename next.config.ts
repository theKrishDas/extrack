import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  allowedDevOrigins: ["192.168.1.*"],
  devIndicators: { position: "top-right" },
};

export default nextConfig;
