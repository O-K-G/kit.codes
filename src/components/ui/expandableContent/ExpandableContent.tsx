"use client";

import { useEffect, useRef, useState } from "react";
import AboutTargetIcon from "@ui/expandableContent/AboutTargetIcon";
import Gauge from "@ui/expandableContent/gauge/Gauge";
import { ExpandableContentProps } from "@constants/interfaces";
import styles from "./ExpandableContent.module.css";

/** How much of the box must be visible for the gauge to run */
const IN_VIEW_THRESHOLD = 0.5;

/**
 * A box that reveals its text by itself: once in view, a gauge runs (see Gauge), then the box expands
 * and shows the text. Not interactive.
 *
 * Accessibility: the text is in the DOM from the start (only visually hidden while the gauge runs), so
 * screen readers read it in place; the gauge is decorative and pauses while out of view. Without
 * JavaScript the text is shown open (see the `scripting` media query in the CSS).
 */
export default function ExpandableContent({ text }: ExpandableContentProps) {
  const boxRef = useRef<HTMLDivElement>(null);
  const [inView, setInView] = useState(false);
  const [open, setOpen] = useState(false);
  /** The gauge's count hit 100%: the corner brackets blink along with it */
  const [full, setFull] = useState(false);

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

  return (
    <div className={styles.container}>
      <div ref={boxRef} className={styles.box} data-open={open}>
        <AboutTargetIcon open={open} blink={full} running={inView} />
        <Gauge
          className={styles.gauge}
          running={inView}
          onFull={() => setFull(true)}
          onComplete={() => setOpen(true)}
        />
        {/* Focusable once open, so keyboard users can scroll a long text (WCAG 2.1.1) */}
        <div
          className={styles.content}
          data-open={open}
          tabIndex={open ? 0 : undefined}
        >
          <p>{text}</p>
        </div>
        <AboutTargetIcon bottom open={open} blink={full} running={inView} />
      </div>
    </div>
  );
}
