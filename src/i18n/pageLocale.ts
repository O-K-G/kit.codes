import { hasLocale } from "next-intl";
import { setRequestLocale } from "next-intl/server";
import { routing } from "./routing";

type LocaleParams = Promise<{ locale?: string }>;

/** The route's locale, or the default one for anything else */
export async function getPageLocale(params: LocaleParams) {
  const { locale } = await params;
  return hasLocale(routing.locales, locale) ? locale : routing.defaultLocale;
}

/**
 * Tells next-intl the route's locale, and returns it. Called by every page and layout, so they can
 * be prerendered: without it, next-intl reads the locale from the request's headers, which makes
 * the page render on every request.
 */
export async function setPageLocale(params: LocaleParams) {
  const locale = await getPageLocale(params);
  setRequestLocale(locale);
  return locale;
}
