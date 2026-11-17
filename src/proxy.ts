import createMiddleware from "next-intl/middleware";
import { routing } from "./i18n/routing";

/**
 * Sends each page request to the visitor's locale (/ → /en) and remembers it (next-intl). The security
 * headers, the CSP included, are the same on every response, so they're set in next.config.ts.
 */
export default createMiddleware(routing);

export const config = {
  // Not Next's own files, Vercel's, nor any file (a path with an extension: images, icons, robots.txt,
  // sitemap.xml...)
  matcher: "/((?!_next|_vercel|.*\\..*).*)",
};
