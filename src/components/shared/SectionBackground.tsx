import { CurrentSection } from "@constants/interfaces";
import { CACHE_VERSION } from "@root/postcss.config.mjs";
import { TAILWIND_SIZES } from "@constants/imagesConfig";
import styles from "./SectionBackground.module.css";

/** This component is a fix to cases in mobile devices in which the user scrolls down in "extreme velocity",
 * and once the browser hits the bottom - the background flickers for a fraction of a second.
 */

const SUFFIX = `.webp?cacheVersion=${CACHE_VERSION}`;

export default function SectionBackground({
  currentSection,
  minHeightClassName = styles.minHeightFull,
}: CurrentSection) {
  if (!currentSection) {
    return null;
  }

  return (
    <div
      className={`${styles.container} ${minHeightClassName}`}
    >
      <picture>
        {TAILWIND_SIZES.map(({ twClassName, pxResolution }) => (
          <source
            key={`tw-class-${twClassName}`}
            srcSet={`/images/${currentSection}-${twClassName}${SUFFIX}`}
            media={`(max-width: ${pxResolution}px)`}
          />
        ))}
        <img
          className={styles.image}
          alt=""
          aria-hidden
          src={`/images/${currentSection}-2xl${SUFFIX}`}
        />
      </picture>
    </div>
  );
}
