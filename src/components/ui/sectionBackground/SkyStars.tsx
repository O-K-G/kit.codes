"use client";

import { CSSProperties, useRef } from "react";
import { STARS } from "@constants/sky";
import useSectionOnScreen from "@hooks/useSectionOnScreen";
import classNames from "@utils/classNames";
import styles from "./SectionSky.module.css";

/** A small seeded random number generator (mulberry32): the same numbers every time */
function random(seed: number) {
  let state = seed;
  return () => {
    state = (state + 0x6d2b79f5) | 0;
    let t = Math.imul(state ^ (state >>> 15), 1 | state);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/** The stars, placed in a section's image, each with its own gentle circling */
function placeStars({ seed, starsTop, height }: SkyStarsProps) {
  const next = random(seed);
  const between = (min: number, max: number) => min + next() * (max - min);

  return STARS.map(([x, y, radius]) => {
    const duration = between(9, 20);
    return {
      x,
      y: starsTop + y,
      radius,
      /** The circle's radius, in the image's pixels */
      orbit: between(5, 10),
      duration,
      /** Somewhere along its circle already */
      delay: -between(0, duration),
      reversed: next() < 0.5,
    };
  }).filter(({ y, radius }) => y - radius < height);
}

interface SkyStarsProps {
  /** Seeds the stars' circling, so each section's sky moves its own way */
  seed: number;
  /** Where the stars' layer sat in the image: its top, at 1x */
  starsTop: number;
  /** The image's height at 1x: stars below it aren't seen */
  height: number;
}

/**
 * A section's stars (see SectionSky), drawn in the browser from the shared star data rather than written
 * into the page, and only while their section is on screen: a few hundred elements per section would
 * otherwise make up most of the page's HTML (twice, with React's data for it), and of its elements.
 */
export default function SkyStars(props: SkyStarsProps) {
  const ref = useRef<HTMLSpanElement>(null);
  const onScreen = useSectionOnScreen(ref, false);
  // Recomputed only when the props change: the React Compiler memoizes it
  const stars = placeStars(props);

  return (
    <span ref={ref} className={styles.stars}>
      {/* Each star turns with its circle (its orbit), whose right edge it sits on: still, the star is
       * exactly at its place in the image; turning, it circles beside it */}
      {onScreen &&
        stars.map(({ x, y, radius, orbit, duration, delay, reversed }) => (
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
    </span>
  );
}
