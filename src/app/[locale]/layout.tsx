import "@locale/globals.css";
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
import { PropsWithChildren } from "react";
import { NextIntlClientProvider } from "next-intl";
import { getPageLocale, setPageLocale } from "@i18n/pageLocale";
import classNames from "@utils/classNames";
import PauseWhileResizing from "@ui/pauseWhileResizing/PauseWhileResizing";

interface RootLayoutProps extends PropsWithChildren {
  /** `rest`: the catch-all route (app/[...rest]) reuses this layout, with no locale */
  params: Promise<{ locale?: string; rest?: string[] }>;
}

/** Each locale's pages are prerendered at build time; any other "locale" is a 404 */
export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export const dynamicParams = false;

const { fontsByLocale } = handleFontsByLocale();

export async function generateMetadata({
  params,
}: Pick<RootLayoutProps, "params">): Promise<Metadata> {
  const selectedLocale = await getPageLocale(params);

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
  const selectedLocale = await setPageLocale(params);
  const dir = getDirByLocale({ locale: selectedLocale });

  const { mainTitle, borderTitle, infoText, regularText, shenanigansText } =
    fontsByLocale[selectedLocale];

  return (
    <html dir={dir} lang={selectedLocale} data-scroll-behavior="smooth">
      <NextIntlClientProvider>
        <body
          className={classNames(mainTitle, borderTitle, infoText, regularText, shenanigansText)}
        >
          {children}
          <PauseWhileResizing />
        </body>
      </NextIntlClientProvider>
    </html>
  );
}
