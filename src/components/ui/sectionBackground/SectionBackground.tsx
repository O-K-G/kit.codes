import { SectionBackgroundProps } from "@constants/interfaces";
import {
  AvifVersion,
  SECTION_BACKGROUNDS_AVIF,
  TAILWIND_SIZES,
} from "@constants/imagesConfig";
import {
  LOADER_CRITICAL_IMAGE_ATTRIBUTE,
  LOADER_DEFERRED_IMAGE_ATTRIBUTE,
} from "@constants/loader";
import { SKIES } from "@constants/sky";
import SectionSky from "@ui/sectionBackground/SectionSky";
import AboutComet from "@ui/sectionBackground/AboutComet";
import styles from "./SectionBackground.module.css";
import classNames from "@utils/classNames";

/** A crop's versions as a srcset: each file with its width ("…/sm-960w.avif 960w") */
const toSrcSet = (versions: AvifVersion[]) =>
  versions.map(({ src, width }) => `${src} ${width}w`).join(", ");

/**
 * How wide the crop is drawn, for the browser to pick a version (times the screen's pixel density):
 * it covers the screen (object-fit: cover), so on a screen narrower than the crop's proportions its
 * height decides, and it's drawn at the screen's height times its aspect ratio; otherwise at the
 * screen's width.
 */
const toSizes = ({ width, height }: AvifVersion) =>
  `(max-aspect-ratio: ${width}/${height}) calc(100vh * ${width} / ${height}), 100vw`;

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

  const avifImages = SECTION_BACKGROUNDS_AVIF[currentSection];
  const widest = avifImages["2xl"];

  return (
    <div
      className={classNames(styles.container, minHeightClassName)}
    >
      {/* Per breakpoint, the crop for that width, in the version the screen needs; wider than every
       * breakpoint, the <img>'s own: the whole width. The files are served as they are (no re-encoding).
       * The route's own background is fetched right away, with high priority, and the loader waits for
       * it; the rest start lazy, so they don't compete with it, and the loader then fetches them (see
       * LoaderVisibility) */}
      <picture>
        {TAILWIND_SIZES.filter(({ twClassName }) => twClassName !== "2xl").map(
          ({ twClassName, pxResolution }) => (
            <source
              key={`tw-class-${twClassName}`}
              srcSet={toSrcSet(avifImages[twClassName])}
              sizes={toSizes(avifImages[twClassName][0])}
              media={`(max-width: ${pxResolution}px)`}
            />
          )
        )}
        <img
          alt=""
          aria-hidden
          src={widest[0].src}
          srcSet={toSrcSet(widest)}
          sizes={toSizes(widest[0])}
          width={widest[0].width}
          height={widest[0].height}
          loading={priority ? "eager" : "lazy"}
          fetchPriority={priority ? "high" : "low"}
          // Decoded before the frame that shows it is drawn: as the window is resized, the browser swaps
          // in the version the new size needs, and asynchronously the frame would be drawn without it
          // meanwhile, flashing black
          decoding="sync"
          {...{
            [priority
              ? LOADER_CRITICAL_IMAGE_ATTRIBUTE
              : LOADER_DEFERRED_IMAGE_ATTRIBUTE]: true,
          }}
        />
      </picture>
      {/* Animated parts drawn over the image, which move and zoom with it: the stars, and About's comet */}
      {SKIES[currentSection] && (
        <div aria-hidden className={styles.overlay}>
          <SectionSky section={currentSection}>
            {currentSection === "about" && <AboutComet />}
          </SectionSky>
        </div>
      )}
    </div>
  );
}
