import { CSSProperties, ReactNode } from "react";
import { SectionName } from "@constants/interfaces";
import { SKIES, STARS } from "@constants/sky";
import classNames from "@utils/classNames";
import PauseOffscreen from "@ui/sectionBackground/PauseOffscreen";
import styles from "./SectionSky.module.css";

/** A small seeded random number generator (mulberry32): the same numbers on every render */
function random(seed: number) {
  let state = seed;
  return () => {
    state = (state + 0x6d2b79f5) | 0;
    let t = Math.imul(state ^ (state >>> 15), 1 | state);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/** A section's stars, placed in its image, each with its own gentle circling */
function starsOf(section: SectionName) {
  const sky = SKIES[section]!;
  const next = random(sky.seed);
  const between = (min: number, max: number) => min + next() * (max - min);

  return STARS.map(([x, y, radius]) => {
    const duration = between(9, 20);
    return {
      x,
      y: sky.starsTop + y,
      radius,
      /** The circle's radius, in the image's pixels */
      orbit: between(5, 10),
      duration,
      /** Somewhere along its circle already */
      delay: -between(0, duration),
      reversed: next() < 0.5,
    };
  }).filter(({ y, radius }) => y - radius < sky.height);
}

/**
 * A section background's stars, drawn over its image (inside SectionBackground's overlay, which follows
 * the image's scroll zoom), each circling gently at its own pace. They were a layer of the illustration
 * (they've been cut out of the image) and sit where they were in it. `children` are drawn over the image
 * too (About's comet).
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
          "--star-opacity": sky.starOpacity,
        } as CSSProperties
      }
    >
      {children}
      {/* Each star turns with its circle (its orbit), whose right edge it sits on: still, the star is
       * exactly at its place in the image; turning, it circles beside it */}
      {starsOf(section).map(({ x, y, radius, orbit, duration, delay, reversed }) => (
        <span
          key={`${x}-${y}`}
          className={classNames(styles.orbit, reversed && styles.reversed)}
          style={
            {
              "--x": x,
              "--y": y,
              "--r": radius,
              "--orbit": orbit.toFixed(2),
              "--duration": `${duration.toFixed(1)}s`,
              "--delay": `${delay.toFixed(1)}s`,
            } as CSSProperties
          }
        >
          <span className={styles.star} />
        </span>
      ))}
    </PauseOffscreen>
  );
}
