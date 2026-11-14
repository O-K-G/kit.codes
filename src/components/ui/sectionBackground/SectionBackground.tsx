import { getImageProps } from "next/image";
import { SectionBackgroundProps } from "@constants/interfaces";
import { SECTION_BACKGROUNDS, TAILWIND_SIZES } from "@constants/imagesConfig";
import {
  LOADER_CRITICAL_IMAGE_ATTRIBUTE,
  LOADER_DEFERRED_IMAGE_ATTRIBUTE,
} from "@constants/loader";
import styles from "./SectionBackground.module.css";
import classNames from "@utils/classNames";

/** This component is a fix to cases in mobile devices in which the user scrolls down in "extreme velocity",
 * and once the browser hits the bottom - the background flickers for a fraction of a second.
 */

export default function SectionBackground({
  currentSection,
  minHeightClassName = styles.minHeightFull,
  priority,
}: SectionBackgroundProps) {
  if (!currentSection) {
    return null;
  }

  const images = SECTION_BACKGROUNDS[currentSection];

  /** `unoptimized`: the files are served as they are (no re-encoding); the <picture> below does the art direction.
   * The route's own background is fetched right away, with high priority, and the loader waits for it.
   * The rest start lazy, so they don't compete with it; the loader then fetches them (see LoaderVisibility). */
  const { props: { alt, ...imgProps } } = getImageProps({
    src: images["2xl"],
    alt: "",
    unoptimized: true,
    loading: priority ? "eager" : "lazy",
    fetchPriority: priority ? "high" : "low",
  });

  return (
    <div
      className={classNames(styles.container, minHeightClassName)}
    >
      <picture>
        {TAILWIND_SIZES.map(({ twClassName, pxResolution }) => (
          <source
            key={`tw-class-${twClassName}`}
            srcSet={images[twClassName].src}
            media={`(max-width: ${pxResolution}px)`}
          />
        ))}
        <img
          alt={alt}
          aria-hidden
          {...{
            [priority
              ? LOADER_CRITICAL_IMAGE_ATTRIBUTE
              : LOADER_DEFERRED_IMAGE_ATTRIBUTE]: true,
          }}
          {...imgProps}
        />
      </picture>
    </div>
  );
}
