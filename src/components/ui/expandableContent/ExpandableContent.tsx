"use client";

import { AnimationEvent, useEffect, useRef, useState } from "react";
import AboutTargetIcon from "@ui/expandableContent/AboutTargetIcon";
import { ExpandableContentProps } from "@constants/interfaces";
import styles from "./ExpandableContent.module.css";

/** How much of the box must be visible for the gauge to run */
const IN_VIEW_THRESHOLD = 0.5;

/**
 * A box that reveals its text by itself: once in view, a gauge fills clockwise (purple to red) around
 * an inner ring and a count to 100%; the count blinks twice, then the box expands and shows the
 * text. Not interactive.
 *
 * Accessibility: the text is in the DOM from the start (only visually hidden while the gauge runs), so
 * screen readers read it in place; the gauge is decorative. The gauge lasts 1.6s, under 5 seconds
 * (WCAG 2.2.2), and pauses while out of view; with reduced motion it completes instantly (see globals.css). Without
 * JavaScript the text is shown open (see the `scripting` media query in the CSS).
 */
export default function ExpandableContent({ text }: ExpandableContentProps) {
  const boxRef = useRef<HTMLDivElement>(null);
  const [inView, setInView] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const box = boxRef.current;
    if (!box || open) return;

    const observer = new IntersectionObserver(
      ([entry]) => setInView(entry.isIntersecting),
      { threshold: IN_VIEW_THRESHOLD }
    );
    observer.observe(box);

    return () => observer.disconnect();
  }, [open]);

  const handleGaugeEnd = (event: AnimationEvent<HTMLDivElement>) => {
    if (event.target === event.currentTarget) setOpen(true);
  };

  return (
    <div className={styles.container}>
      <div ref={boxRef} className={styles.box} data-open={open}>
        <AboutTargetIcon open={open} />
        <div aria-hidden className={styles.gauge}>
          <div className={`${styles.gaugeRing} ${styles.gaugeTrack}`} />
          <div className={styles.gaugeGlow} data-running={inView}>
            <div className={styles.gaugeRing}>
              <div className={styles.gaugeFill} data-running={inView} />
            </div>
          </div>
          <div className={styles.gaugeRing}>
            <div
              className={styles.gaugeFill}
              data-running={inView}
            />
          </div>
          <div className={`${styles.gaugeGlow} ${styles.innerGlow}`} data-running={inView}>
            <div className={styles.innerShape}>
              <div className={styles.innerSegments}>
                <div className={styles.innerFill} data-running={inView} />
              </div>
            </div>
          </div>
          <div className={`${styles.innerShape} ${styles.innerRing}`}>
            <div className={styles.innerSegments}>
              <div className={styles.innerTrack} />
              <div className={styles.innerFill} data-running={inView} />
            </div>
          </div>
          <div className={styles.gaugeCount} data-running={inView}>
            <span
              className={styles.gaugeCountText}
              data-running={inView}
              onAnimationEnd={handleGaugeEnd}
            />
          </div>
        </div>
        {/* Focusable once open, so keyboard users can scroll a long text (WCAG 2.1.1) */}
        <div
          className={styles.content}
          data-open={open}
          tabIndex={open ? 0 : undefined}
        >
          <p>{text}</p>
        </div>
        <AboutTargetIcon bottom open={open} />
      </div>
    </div>
  );
}
