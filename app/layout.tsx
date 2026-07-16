import type { Metadata, Viewport } from "next";
import { connection } from "next/server";
import { headers } from "next/headers";
import "./globals.css";
import Nav from "@components/nav/nav";
import { FONTS_VARIABLES } from "@utils/handleFonts";
import { APP_META, PERSON_JSON_LD } from "@constants/appMeta";

export const metadata: Metadata = APP_META;

// Claude PR: there was no viewport export anywhere, so the site had no viewport meta
// tag at all — a real mobile-usability/SEO issue for a responsive layout (mobile
// browsers default to rendering at desktop width without one). This is a separate
// export from `metadata` per the Next.js Metadata API.
export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#0a0e1a",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  await connection();

  // Claude PR: proxy.ts sets a strict nonce-based CSP (script-src 'self'
  // 'nonce-...' 'strict-dynamic', no 'unsafe-inline' in production) but nothing in the
  // app read the x-nonce header it emits, so no inline <script> could ever run in
  // production. Needed for the JSON-LD structured-data script below.
  const nonce = (await headers()).get("x-nonce") ?? undefined;

  return (
    <html lang="en" className={FONTS_VARIABLES}>
      <body>
        {/* Claude PR: there was no way for keyboard/screen-reader users to skip past the
            nav's ~7 links to reach the page content directly. Visually hidden until
            focused (see .skipLink in globals.css). */}
        <a href="#main-content" className="skipLink">
          Skip to content
        </a>
        <Nav />
        {children}
        {/* Claude PR: no structured data existed anywhere on the site. This gives search
            engines a machine-readable Person profile for the page. suppressHydrationWarning
            is required here: browsers hide a <script>'s nonce *attribute* from reflection
            (getAttribute/outerHTML report "") right after parsing it, specifically to
            prevent the nonce being read back out via HTML serialization — the real value
            stays applied for CSP purposes via the element's .nonce property. Without this,
            React's hydration diff flags that browser-side redaction as a mismatch even
            though the nonce is genuinely working (confirmed no CSP violation is thrown). */}
        <script
          type="application/ld+json"
          nonce={nonce}
          suppressHydrationWarning
          dangerouslySetInnerHTML={{ __html: JSON.stringify(PERSON_JSON_LD) }}
        />
      </body>
    </html>
  );
}
