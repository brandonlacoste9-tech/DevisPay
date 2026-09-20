import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/dashboard", "/api/", "/login", "/register"],
      },
    ],
    sitemap: "https://devispay.com/sitemap.xml",
    host: "https://devispay.com",
  };
}
