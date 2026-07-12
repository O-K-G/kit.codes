import { EXPERIENCE_YEARS } from "../page.constants";

export const APP_META = {
  title: "Kit G. — Web Developer",
  description: `Landing page of Kit G., a Full-Stack Web Developer with ${EXPERIENCE_YEARS} years building accessible React and Next.js applications.`,
  applicationName: "kit.codes",
  manifest: "/manifest.webmanifest",
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
