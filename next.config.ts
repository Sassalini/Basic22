import type { NextConfig } from "next";

if (process.env.NODE_ENV === "development") {
  void import("@opennextjs/cloudflare").then((m) => m.initOpenNextCloudflareForDev());
}

const nextConfig: NextConfig = {};

export default nextConfig;
