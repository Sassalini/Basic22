import { defineCloudflareConfig, type OpenNextConfig } from "@opennextjs/cloudflare";

const config: OpenNextConfig = {
  ...defineCloudflareConfig({}),
  buildCommand: "npm run next:build",
};

export default config;
