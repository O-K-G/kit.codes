import "@locale/globals.css";
import styles from "./layout.module.css";
import { Metadata, Viewport } from "next";
import {
  siteMetadata,
  LOCALE_ALTERNATES,
  OG_LOCALES,
  getLocalePath,
} from "@constants/siteMetadata";
import { routing } from "@i18n/routing";
import handleFontsByLocale from "@utils/handleFontsByLocale";
import getDirByLocale from "@utils/getDirByLocale";
import { PropsWithChildren, ReactNode } from "react";
import { NextIntlClientProvider, hasLocale } from "next-intl";

interface RootLayoutProps extends PropsWithChildren {
  params: Promise<{ locale?: string; rest?: string[] }>;
}

const { fontsByLocale } = handleFontsByLocale();

export async function generateMetadata({
  params,
}: Pick<RootLayoutProps, "params">): Promise<Metadata> {
  const { locale } = await params;
  const selectedLocale = hasLocale(routing.locales, locale)
    ? locale
    : routing.defaultLocale;

  return {
    ...siteMetadata,
    alternates: {
      /** Every section route (/en/about, /en/skills, ...) renders this same page, scrolled to a section. */
      canonical: getLocalePath(selectedLocale),
      languages: LOCALE_ALTERNATES,
    },
    /** The link preview, in the page's language, pointing at its locale root like the canonical URL */
    openGraph: {
      ...siteMetadata.openGraph,
      url: getLocalePath(selectedLocale),
      locale: OG_LOCALES[selectedLocale],
      alternateLocale: routing.locales
        .filter((other) => other !== selectedLocale)
        .map((other) => OG_LOCALES[other]),
    },
  };
}

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  interactiveWidget: "resizes-content",
};

export default async function RootLayout({
  children,
  params,
}: RootLayoutProps) {
  const { locale } = await params;
  const selectedLocale = locale || "en";
  const dir = getDirByLocale({ locale: selectedLocale }) || "ltr";

  const { mainTitle, borderTitle, infoText, regularText, shenanigansText } =
    fontsByLocale[selectedLocale as keyof typeof fontsByLocale];

  return (
    <html dir={dir} lang={selectedLocale} data-scroll-behavior="smooth">
      <NextIntlClientProvider>
        <body
          className={`${styles.body} ${mainTitle} ${borderTitle} ${infoText} ${regularText} ${shenanigansText}`}
        >
          {children}
        </body>
      </NextIntlClientProvider>
    </html>
  );
}
