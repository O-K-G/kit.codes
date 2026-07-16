import { MetadataRoute } from "next";
import { SITE_URL } from "./constants/appMeta";

// Claude PR: no robots.txt existed at all. This generates one at /robots.txt allowing
// all crawlers and pointing them at the sitemap (see sitemap.ts).
export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
    },
    sitemap: `${SITE_URL}/sitemap.xml`,
  };
}
