import { MetadataRoute } from "next";
import { SITE_URL } from "./constants/appMeta";

// Claude PR: no sitemap existed at all. This site is a single scrolling page, so the
// sitemap has exactly one entry for the root URL.
export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: SITE_URL,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 1,
    },
  ];
}
