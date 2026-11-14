"use client";

import { AnimationEvent } from "react";
import { GaugeProps } from "@constants/interfaces";
import styles from "./Gauge.module.css";

/**
 * A decorative gauge that fills by itself: an outer ring (purple to red), a segmented inner ring
 * (white to pale orange, glowing red) and a count to 100% in the middle. Once the count has blinked
 * twice it calls `onComplete` (and `onFull` as it hits 100%, so others can blink along). It fills its parent; pass a `className` to size and place it.
 *
 * Accessibility: hidden from screen readers. It lasts 1.6s, under 5 seconds (WCAG 2.2.2); with
 * reduced motion it completes instantly (see globals.css), still calling `onComplete`.
 */
export default function Gauge({ running, onFull, onComplete, className = "" }: GaugeProps) {
  const handleCountFull = (event: AnimationEvent<HTMLDivElement>) => {
    if (event.target === event.currentTarget) onFull?.();
  };

  const handleCountEnd = (event: AnimationEvent<HTMLSpanElement>) => {
    if (event.target === event.currentTarget) onComplete?.();
  };

  return (
    <div aria-hidden className={`${styles.gauge} ${className}`}>
      <div className={`${styles.ring} ${styles.track}`} />
      <div className={styles.glow} data-running={running}>
        <div className={styles.ring}>
          <div className={styles.fill} data-running={running} />
        </div>
      </div>
      <div className={styles.ring}>
        <div className={styles.fill} data-running={running} />
      </div>
      <div className={`${styles.glow} ${styles.innerGlow}`} data-running={running}>
        <div className={styles.innerShape}>
          <div className={styles.innerSegments}>
            <div className={styles.innerFill} data-running={running} />
          </div>
        </div>
      </div>
      <div className={`${styles.innerShape} ${styles.innerRing}`}>
        <div className={styles.innerSegments}>
          <div className={styles.innerTrack} />
          <div className={styles.innerFill} data-running={running} />
        </div>
      </div>
      <div
        className={styles.count}
        data-running={running}
        onAnimationEnd={handleCountFull}
      >
        <span
          className={styles.countText}
          data-running={running}
          onAnimationEnd={handleCountEnd}
        />
      </div>
    </div>
  );
}
