import { CSSProperties, ReactNode } from "react";
import { SectionName } from "@constants/interfaces";
import { SKIES } from "@constants/sky";
import PauseOffscreen from "@ui/sectionBackground/PauseOffscreen";
import SkyStars from "@ui/sectionBackground/SkyStars";
import styles from "./SectionSky.module.css";

/**
 * A section background's stars, drawn over its image (inside SectionBackground's overlay, which follows
 * the image's scroll zoom), each circling gently at its own pace. They were a layer of the illustration
 * (they've been cut out of the image) and sit where they were in it. `children` are drawn over the image
 * too (About's comet).
 *
 * The stars are drawn in the browser, on a canvas, while the section is on screen (see SkyStars).
 *
 * Decorative: hidden from screen readers. With reduced motion, they hold still; off screen, they pause.
 */
export default function SectionSky({
  section,
  children,
}: {
  section: SectionName;
  children?: ReactNode;
}) {
  const sky = SKIES[section];
  if (!sky) {
    return null;
  }

  return (
    <PauseOffscreen
      className={styles.frame}
      style={
        {
          "--h": sky.height,
          "--centered": Number(sky.centered),
        } as CSSProperties
      }
    >
      {children}
      <SkyStars seed={sky.seed} starsTop={sky.starsTop} height={sky.height} opacity={sky.starOpacity} />
    </PauseOffscreen>
  );
}
