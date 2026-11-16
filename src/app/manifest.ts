import { MetadataRoute } from "next";
import { CACHE_VERSION } from "@constants/siteMetadata";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "kit.codes",
    short_name: "kit.codes",
    description: "My landing page",
    start_url: "/",
    display: "browser",
    background_color: "#ffffff",
    theme_color: "#ffffff",
    icons: [
      {
        src: `/images/astronaut-coding-laptop-app-icon-192x192.png?cacheVersion=${CACHE_VERSION}`,
        sizes: "192x192",
        type: "image/png",
      },
      {
        src: `/images/astronaut-coding-laptop-app-icon-512x512.png?cacheVersion=${CACHE_VERSION}`,
        sizes: "512x512",
        type: "image/png",
      },
    ],
  };
}
