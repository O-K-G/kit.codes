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
import { getMessages, getTranslations } from "next-intl/server";
import { CLIENT_NAMESPACES } from "@constants/i18nFilenames";
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
  /** The description, in the page's language (see SITE_DESCRIPTION) */
  const t = await getTranslations({ locale: selectedLocale, namespace: "about" });
  const description = t("metaDescription");

  return {
    ...siteMetadata,
    description,
    twitter: { ...siteMetadata.twitter, description },
    alternates: {
      /** Every section route (/en/about, /en/skills, ...) renders this same page, scrolled to a section. */
      canonical: getLocalePath(selectedLocale),
      languages: LOCALE_ALTERNATES,
    },
    /** The link preview, in the page's language, pointing at its locale root like the canonical URL */
    openGraph: {
      ...siteMetadata.openGraph,
      description,
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
  /* <meta name="color-scheme">: the browser knows the page's schemes before the CSS loads, so the
   * canvas doesn't flash white in dark mode (see color-scheme in globals.css) */
  colorScheme: "light dark",
};

export default async function RootLayout({
  children,
  params,
}: RootLayoutProps) {
  const selectedLocale = await setPageLocale(params);
  const dir = getDirByLocale({ locale: selectedLocale });
  const messages = await getMessages();
  /** Only what client components need goes to the browser (see CLIENT_NAMESPACES) */
  const clientMessages = Object.fromEntries(
    CLIENT_NAMESPACES.map((namespace) => [namespace, messages[namespace]])
  );

  const { mainTitle, borderTitle, infoText, regularText, shenanigansText } =
    fontsByLocale[selectedLocale];

  return (
    <html dir={dir} lang={selectedLocale} data-scroll-behavior="smooth">
      <NextIntlClientProvider messages={clientMessages}>
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
