import { defineRouting } from "next-intl/routing";

export const routing = defineRouting({
  locales: ["en", "he"],
  defaultLocale: "en",
  /** Disables the middleware's hreflang `Link` header: it would point at every section route
   * (e.g. /he/about), while those routes are canonicalized to their locale root. The hreflang
   * alternates are declared in the root layout's metadata instead. */
  alternateLinks: false,
});
