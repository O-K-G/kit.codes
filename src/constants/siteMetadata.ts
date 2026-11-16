import { Metadata } from "next";
import { URLs } from "@constants/urls";
import { routing } from "@i18n/routing";
import enAbout from "@root/messages/en/about.json";

/** Added to the icons' URLs: raise it after changing an icon, so browsers fetch the new one */
export const CACHE_VERSION = 1;

type Locale = (typeof routing.locales)[number];

/** The page is served per locale, at /en and /he. */
export const getLocalePath = (locale: Locale) => `/${locale}`;

/** hreflang alternates, relative to `metadataBase` (absolute URLs are required in the sitemap). */
export const LOCALE_ALTERNATES = {
  ...Object.fromEntries(
    routing.locales.map((locale) => [locale, getLocalePath(locale)]),
  ),
  "x-default": getLocalePath(routing.defaultLocale),
} as Record<Locale | "x-default", string>;

const SITE_TITLE = "kit.codes";
/** Search results' and link previews' description, short enough not to be cut off (about 155
 * characters): English by default; each locale's page has its own (see app/[locale]/layout.tsx) */
const SITE_DESCRIPTION = enAbout.about.metaDescription;

/** Open Graph locales (language_TERRITORY) of the page's locales. The link preview image comes from
 * app/[locale]/opengraph-image.tsx and twitter-image.tsx. */
export const OG_LOCALES: Record<Locale, string> = { en: "en_US", he: "he_IL" };

export const siteMetadata: Metadata = {
  metadataBase: new URL(URLs.siteURL),
  title: SITE_TITLE,
  description: SITE_DESCRIPTION,
  openGraph: {
    type: "website",
    siteName: SITE_TITLE,
    title: SITE_TITLE,
    description: SITE_DESCRIPTION,
  },
  twitter: {
    card: "summary_large_image",
    title: SITE_TITLE,
    description: SITE_DESCRIPTION,
  },
  applicationName: "kit.codes",
  manifest: "/manifest.webmanifest",
  icons: {
    icon: `/images/astronaut-coding-laptop-favicon-32x32.png?cacheVersion=${CACHE_VERSION}`,
    shortcut: `/images/astronaut-coding-laptop-favicon-16x16.png?cacheVersion=${CACHE_VERSION}`,
    apple: `/images/astronaut-coding-laptop-apple-touch-icon-180x180.png?cacheVersion=${CACHE_VERSION}`,
    other: [
      {
        rel: "mask-icon",
        url: `/images/astronaut-coding-laptop-safari-pinned-tab.svg?cacheVersion=${CACHE_VERSION}`,
        type: "image/svg+xml",
        sizes: "any",
      },
    ],
  },
};
