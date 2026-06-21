import type { MetadataRoute } from "next";

const siteUrl = "https://www.basic22.com";
const publicRoutes = ["/", "/privacy", "/terms", "/community-standards", "/cookies"];

export default function sitemap(): MetadataRoute.Sitemap {
  return publicRoutes.map((route) => ({
    url: new URL(route, siteUrl).toString()
  }));
}
