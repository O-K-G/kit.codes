import { Fragment } from "react";
import { getImageProps } from "next/image";
import { SectionBackgroundProps } from "@constants/interfaces";
import {
  AvifVersion,
  SECTION_BACKGROUNDS,
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

  const images = SECTION_BACKGROUNDS[currentSection];
  const avifImages = SECTION_BACKGROUNDS_AVIF[currentSection];

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
      {/* The browser takes the first source it can show whose media matches: per width, the AVIF crop
       * if it supports AVIF (in the version its screen needs), else the WebP one. Wider than every
       * breakpoint, the 2xl AVIF, else the <img> (the 2xl WebP) */}
      <picture>
        {TAILWIND_SIZES.map(({ twClassName, pxResolution }) => (
          <Fragment key={`tw-class-${twClassName}`}>
            <source
              type="image/avif"
              srcSet={toSrcSet(avifImages[twClassName])}
              sizes={toSizes(avifImages[twClassName][0])}
              media={`(max-width: ${pxResolution}px)`}
            />
            <source
              type="image/webp"
              srcSet={images[twClassName].src}
              media={`(max-width: ${pxResolution}px)`}
            />
          </Fragment>
        ))}
        <source
          type="image/avif"
          srcSet={toSrcSet(avifImages["2xl"])}
          sizes={toSizes(avifImages["2xl"][0])}
        />
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
