import { useTranslations } from "next-intl";
import planet1565 from "@/assets/images/planet/1565w.avif?url";
import planet2348 from "@/assets/images/planet/2348w.avif?url";
import planet3130 from "@/assets/images/planet/3130w.avif?url";
import planet4695 from "@/assets/images/planet/4695w.avif?url";
import planet6260 from "@/assets/images/planet/6260w.avif?url";
import { LOADER_CRITICAL_IMAGE_ATTRIBUTE } from "@constants/loader";
import styles from "./Planet.module.css";

/**
 * The planet in AVIF (from Frame 1.png), at 1, 1.5, 2, 3 and 4 times its size (1565 by 1566), each with
 * its width: browsers take the smallest that's sharp on their screen. (The widths are given here: they're
 * imported as URLs, see next.config.ts.)
 */
const AVIF_SRC_SET = (
  [
    [planet1565, 1565],
    [planet2348, 2348],
    [planet3130, 3130],
    [planet4695, 4695],
    [planet6260, 6260],
  ] as [string, number][]
)
  .map(([src, width]) => `${src} ${width}w`)
  .join(", ");

/**
 * How wide the planet is drawn (see Planet.module.css): 70% of the screen's width from 1024px, its whole
 * width below that; up to 768px, scrolling also scales it up to twice that
 */
const SIZES = "(min-width: 1024px) 70vw, (min-width: 769px) 100vw, 200vw";

export default function Planet() {
  const t = useTranslations("planet");

  return (
    <div className={styles.container}>
      <div>
        {/* Peeks from the bottom of the first screen on every route, so it's fetched right away, and
         * the loader waits for it. The files are served as they are (no re-encoding) */}
        <img
          alt={t("alt")}
          src={planet1565}
          srcSet={AVIF_SRC_SET}
          sizes={SIZES}
          width={1565}
          height={1566}
          loading="eager"
          fetchPriority="high"
          decoding="async"
          {...{ [LOADER_CRITICAL_IMAGE_ATTRIBUTE]: true }}
        />
      </div>
    </div>
  );
}
