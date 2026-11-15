import { Metadata } from "next";
import { URLs } from "@constants/urls";
import { routing } from "@i18n/routing";

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
const SITE_DESCRIPTION =
  "This is my landing page to showcase some of my web development skills.";

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
    icon: `/images/icon.png?cacheVersion=${CACHE_VERSION}`,
    shortcut: `/images/shortcut-icon.png?cacheVersion=${CACHE_VERSION}`,
    apple: `/images/apple-icon.png?cacheVersion=${CACHE_VERSION}`,
    other: [
      {
        rel: "mask-icon",
        url: `/images/safari-pinned-tab.svg?cacheVersion=${CACHE_VERSION}`,
        type: "image/svg+xml",
        sizes: "any",
      },
    ],
  },
};
