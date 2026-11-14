import { StaticImageData, getImageProps } from "next/image";
import { useTranslations } from "next-intl";
import planet from "@/assets/images/planet/1565w.webp";
import planet1565 from "@/assets/images/planet/1565w.avif";
import planet2348 from "@/assets/images/planet/2348w.avif";
import planet3130 from "@/assets/images/planet/3130w.avif";
import planet4695 from "@/assets/images/planet/4695w.avif";
import planet6260 from "@/assets/images/planet/6260w.avif";
import { LOADER_CRITICAL_IMAGE_ATTRIBUTE } from "@constants/loader";
import styles from "./Planet.module.css";

/**
 * The planet in AVIF, at 1, 1.5, 2, 3 and 4 times its WebP version's size (from Frame 1.png), each with
 * its width: browsers that support AVIF take the smallest that's sharp on their screen, the others the
 * WebP one. (The widths are given here, as Next doesn't read AVIF files' sizes.)
 */
const AVIF_SRC_SET = (
  [
    [planet1565, 1565],
    [planet2348, 2348],
    [planet3130, 3130],
    [planet4695, 4695],
    [planet6260, 6260],
  ] as [StaticImageData, number][]
)
  .map(([{ src }, width]) => `${src} ${width}w`)
  .join(", ");

/**
 * How wide the planet is drawn (see Planet.module.css): 70% of the screen's width from 1024px, its whole
 * width below that; up to 768px, scrolling also scales it up to twice that
 */
const SIZES = "(min-width: 1024px) 70vw, (min-width: 769px) 100vw, 200vw";

export default function Planet() {
  const t = useTranslations("planet");

  /** Peeks from the bottom of the first screen on every route, so the loader waits for it.
   * `unoptimized`: the files are served as they are (the AVIF ones come in the sizes screens need). */
  const { props: { alt, ...props } } = getImageProps({
    src: planet,
    alt: t("alt"),
    unoptimized: true,
    loading: "eager",
    fetchPriority: "high",
  });

  return (
    <div className={styles.container}>
      <div>
        <picture>
          <source type="image/avif" srcSet={AVIF_SRC_SET} sizes={SIZES} />
          <img alt={alt} {...props} {...{ [LOADER_CRITICAL_IMAGE_ATTRIBUTE]: true }} />
        </picture>
      </div>
    </div>
  );
}
