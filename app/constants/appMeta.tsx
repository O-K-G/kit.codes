import { EXPERIENCE_YEARS } from "../page.constants";

// Claude PR: needed in one place so metadataBase/openGraph/twitter/canonical/robots.ts/
// sitemap.ts can all reference the same absolute origin instead of repeating it.
export const SITE_URL = "https://www.kit.codes";

const TITLE = "Kit G. — Web Developer";
const DESCRIPTION = `Landing page of Kit G., a Full-Stack Web Developer with ${EXPERIENCE_YEARS} years building accessible React and Next.js applications.`;
// Falls back to the existing 512px favicon since there's no dedicated OG image asset.
const OG_IMAGE = "/images/favicon-maple-code-512.png";

export const APP_META = {
  title: TITLE,
  description: DESCRIPTION,
  applicationName: "kit.codes",
  manifest: "/manifest.webmanifest",
  // Claude PR: none of metadataBase/openGraph/twitter/alternates/robots were set, so the
  // site had no social-share preview (Open Graph/Twitter card), no canonical URL, and no
  // explicit crawler directives — all real SEO gaps for a public portfolio site.
  metadataBase: new URL(SITE_URL),
  openGraph: {
    title: TITLE,
    description: DESCRIPTION,
    url: SITE_URL,
    siteName: "kit.codes",
    images: [OG_IMAGE],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary",
    title: TITLE,
    description: DESCRIPTION,
    images: [OG_IMAGE],
  },
  alternates: {
    canonical: SITE_URL,
  },
  robots: {
    index: true,
    follow: true,
  },
  icons: {
    icon: [
      {
        url: `/images/favicon-maple-code-32.png`,
        type: "image/png",
        sizes: "32x32",
      },
      {
        url: `/images/favicon-maple-code-192.png`,
        type: "image/png",
        sizes: "192x192",
      },
      {
        url: `/images/favicon-maple-code-512.png`,
        type: "image/png",
        sizes: "512x512",
      },
    ],
    shortcut: `/images/favicon-maple-code-32.png`,
    apple: `/images/favicon-maple-code-180.png`,
    other: [
      {
        rel: "mask-icon",
        url: `/images/favicon-maple-code.svg`,
        type: "image/svg+xml",
        sizes: "any",
      },
    ],
  },
};

// Claude PR: no structured data existed anywhere on the site. A Person schema lets
// search engines understand this is a personal/professional profile page. Rendered as
// a JSON-LD <script> in layout.tsx (with the CSP nonce, since inline scripts are
// otherwise blocked by the strict-dynamic policy in proxy.ts).
export const PERSON_JSON_LD = {
  "@context": "https://schema.org",
  "@type": "Person",
  name: "Kit G.",
  jobTitle: "Full-Stack Web Developer",
  url: SITE_URL,
  description: DESCRIPTION,
};
