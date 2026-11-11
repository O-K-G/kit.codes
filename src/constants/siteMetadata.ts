import { Metadata } from "next";
import { CACHE_VERSION } from "@root/postcss.config.mjs";
import { URLs } from "@constants/urls";
import { routing } from "@i18n/routing";

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

export const siteMetadata: Metadata = {
  metadataBase: new URL(URLs.siteURL),
  title: "Dev Space Center",
  description:
    "This is my landing page to showcase some of my web development skills. ",
  applicationName: "devspacecenter",
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
