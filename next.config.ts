import { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

const isDev = process.env.NODE_ENV === "development";
const isPreview = process.env.VERCEL_ENV === "preview";

/** Vercel's toolbar (and its live updates), allowed on preview deployments only */
const PREVIEW_SOURCES = isPreview
  ? " *.vercel.live vercel.live *.vercel.com vercel.com *.pusher.com pusher.com wss://*.pusher.com wss://pusher.com"
  : "";

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
  async headers() {
    return [{ source: "/:path*", headers: SECURITY_HEADERS }];
  },
};

const withNextIntl = createNextIntlPlugin();
export default withNextIntl(nextConfig);
