"use client";

import { AnimationEvent } from "react";
import { GaugeProps } from "@constants/interfaces";
import styles from "./Gauge.module.css";
import classNames from "@utils/classNames";

/**
 * A decorative gauge that fills by itself: an outer ring (purple to red), a segmented inner ring
 * (white to pale orange, glowing red) and a count to 100% in the middle. Once the count has blinked
 * twice it calls `onComplete` (and `onFull` as it hits 100%, so others can blink along). It fills its
 * parent; pass a `className` to size and place it. Its layers are drawn in the CSS, as pseudo-elements.
 *
 * Accessibility: hidden from screen readers. It lasts 1.6s, under 5 seconds (WCAG 2.2.2); with
 * reduced motion it completes instantly (see globals.css), still calling `onComplete`.
 */
export default function Gauge({ running, onFull, onComplete, className }: GaugeProps) {
  /** The count's own animation ends at 100%; its text's (::after) blink ends the gauge */
  const handleCountEnd = ({ target, currentTarget, pseudoElement }: AnimationEvent<HTMLDivElement>) => {
    if (target !== currentTarget) return;

    if (pseudoElement === "::after") {
      onComplete?.();
    } else {
      onFull?.();
    }
  };

  return (
    <div aria-hidden data-running={running} className={classNames(styles.gauge, className)}>
      <div className={styles.glow} />
      <div className={styles.inner} />
      <div className={styles.count} onAnimationEnd={handleCountEnd} />
    </div>
  );
}
