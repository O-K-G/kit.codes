import { MetadataRoute } from "next";
import { APP_META } from "./constants/appMeta";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: APP_META.title,
    short_name: "kit.codes",
    description: APP_META.description,
    start_url: "/",
    display: "browser",
    background_color: "#0a0e1a",
    theme_color: "#0a0e1a",
    icons: [
      {
        src: `/images/favicon-maple-code-192.png`,
        sizes: "192x192",
        type: "image/png",
      },
      {
        src: `/images/favicon-maple-code-512.png`,
        sizes: "512x512",
        type: "image/png",
      },
    ],
  };
}
