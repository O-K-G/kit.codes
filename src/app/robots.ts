import { MetadataRoute } from "next";
import { URLs } from "@constants/urls";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
    },
    sitemap: `${URLs.siteURL}/sitemap.xml`,
  };
}
