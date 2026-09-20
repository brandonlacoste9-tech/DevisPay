import type { MetadataRoute } from "next";
import { TRADES } from "@/lib/seo-trades";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  const pages = [
    "",
    "/contractors",
    "/entrepreneurs",
    "/q/demo",
    "/privacy",
    "/terms",
    ...TRADES.map((t) => `/for/${t.slug}`),
  ];
  return pages.map((path, i) => ({
    url: `https://devispay.com${path}`,
    lastModified: now,
    changeFrequency: path === "" ? "weekly" : "monthly",
    priority: path === "" ? 1 : i < 3 ? 0.9 : 0.7,
  }));
}
