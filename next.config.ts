import { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

const isDev = process.env.NODE_ENV === "development";
const isPreview = process.env.VERCEL_ENV === "preview";

/** Vercel's toolbar (and its live updates), allowed on preview deployments only */
const PREVIEW_SOURCES = isPreview
  ? " *.vercel.live vercel.live *.vercel.com vercel.com *.pusher.com pusher.com wss://*.pusher.com wss://pusher.com"
  : "";

/**
 * Trusted Types: the browser refuses plain strings where they would run as code (innerHTML, eval,
 * script URLs...), and no policy may be created to turn strings into such code ('none'): neither the
 * site, React nor Next needs one. Not in development, whose tools run code with eval, nor on previews,
 * whose Vercel toolbar injects scripts.
 */
const enforceTrustedTypes = !isDev && !isPreview;

/**
 * The Content-Security-Policy, the same on every response, so the pages can be prerendered and
 * cached (a per-request nonce would render each page on every request). Scripts and styles come
 * from this site only; 'unsafe-inline' is needed by Next's inline scripts (each page's data) and by
 * React's inline style attributes. Directives left out (fonts, connections, frames) fall back to
 * default-src 'self'.
 */
const CSP = [
  "default-src 'self'",
  // React's development build uses eval
  `script-src 'self' 'unsafe-inline'${isDev ? " 'unsafe-eval'" : ""}${PREVIEW_SOURCES}`,
  `style-src 'self' 'unsafe-inline'${PREVIEW_SOURCES}`,
  `img-src 'self' blob: data:${PREVIEW_SOURCES}`,
  isPreview && `connect-src 'self'${PREVIEW_SOURCES}`,
  isPreview && `frame-src 'self'${PREVIEW_SOURCES}`,
  "object-src 'none'",
  "base-uri 'self'",
  "form-action 'self'",
  "frame-ancestors 'none'",
  enforceTrustedTypes && "require-trusted-types-for 'script'",
  enforceTrustedTypes && "trusted-types 'none'",
  !isDev && "upgrade-insecure-requests",
]
  .filter(Boolean)
  .join("; ");

/** Security headers, the same on every response */
const SECURITY_HEADERS = [
  { key: "Content-Security-Policy", value: CSP },
  // Browsers use the declared Content-Type, rather than guess one from the content
  { key: "X-Content-Type-Options", value: "nosniff" },
  // Other sites see only this site's origin when linked from it, not the page's path
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  // None of these features are used: no page, or anything embedded in it, may ask for them
  {
    key: "Permissions-Policy",
    value: "camera=(), microphone=(), geolocation=(), payment=(), usb=()",
  },
  // HTTPS only, for two years (ignored on plain-HTTP localhost)
  { key: "Strict-Transport-Security", value: "max-age=63072000; includeSubDomains" },
  // Pages opened from this site (or that open it) can't reach into its window
  { key: "Cross-Origin-Opener-Policy", value: "same-origin" },
];

const nextConfig: NextConfig = {
  // Doesn't advertise the framework (X-Powered-By: Next.js)
  poweredByHeader: false,
  /* The React Compiler memoizes components and hooks at build time (babel-plugin-react-compiler), so
   * the code needs no useMemo, useCallback or memo of its own */
  reactCompiler: true,
  turbopack: {
    rules: {
      /* AVIF images imported with "?url" are emitted as they are (with a content hash) and imported as
       * their URL. Imported as images instead, Turbopack warns on each one that it can't process AVIF,
       * on every build and compile, though it serves them as they are anyway (see src/types/avif.d.ts) */
      "*.avif": [{ condition: { query: "?url" }, type: "asset" }],
    },
  },
  async headers() {
    return [{ source: "/:path*", headers: SECURITY_HEADERS }];
  },
  /* Permanent (308) redirects from URLs the site had before: the Projects section, renamed Reviews, and
   * the icons, renamed (search engines, links and installed apps may still have their old URLs) */
  async redirects() {
    const icon = (from: string, to: string) => ({
      source: `/images/${from}`,
      destination: `/images/astronaut-coding-laptop-${to}`,
      permanent: true,
    });
    return [
      { source: "/:locale(en|he)/projects", destination: "/:locale/reviews", permanent: true },
      icon("android-chrome-192x192.png", "app-icon-192x192.png"),
      icon("android-chrome-512x512.png", "app-icon-512x512.png"),
      icon("apple-icon.png", "apple-touch-icon-180x180.png"),
      icon("icon.png", "favicon-32x32.png"),
      icon("shortcut-icon.png", "favicon-16x16.png"),
      icon("safari-pinned-tab.svg", "safari-pinned-tab.svg"),
    ];
  },
};

const withNextIntl = createNextIntlPlugin();
export default withNextIntl(nextConfig);
