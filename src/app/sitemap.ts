import { MetadataRoute } from "next";
import { URLs } from "@constants/urls";
import { routing } from "@i18n/routing";
import { LOCALE_ALTERNATES, getLocalePath } from "@constants/siteMetadata";

/** Lists only the canonical URLs: one page per locale (the section routes canonicalize to them). */
export default function sitemap(): MetadataRoute.Sitemap {
  const languages = Object.fromEntries(
    Object.entries(LOCALE_ALTERNATES).map(([hrefLang, path]) => [
      hrefLang,
      `${URLs.siteURL}${path}`,
    ]),
  );

  return routing.locales.map((locale) => ({
    url: `${URLs.siteURL}${getLocalePath(locale)}`,
    changeFrequency: "monthly",
    priority: locale === routing.defaultLocale ? 1 : 0.9,
    alternates: { languages },
  }));
}
