import type { MetadataRoute } from "next";

const siteUrl = "https://www.basic22.com";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: ["/", "/privacy", "/terms", "/community-standards", "/cookies"],
      disallow: [
        "/auth/",
        "/friends",
        "/home",
        "/messages",
        "/settings",
        "/sign-in",
        "/sign-up"
      ]
    },
    sitemap: `${siteUrl}/sitemap.xml`,
    host: siteUrl
  };
}
