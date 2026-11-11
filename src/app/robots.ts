import { MetadataRoute } from "next";
import { URLs } from "@constants/urls";
import { routing } from "@i18n/routing";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      /** The CV download endpoints return JSON, not pages. */
      disallow: routing.locales.map((locale) => `/${locale}/cv`),
    },
    sitemap: `${URLs.siteURL}/sitemap.xml`,
  };
}
