"use client";

import { AnimationEvent, useEffect, useRef, useState } from "react";
import classNames from "@utils/classNames";
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
 * It shows `children` in place of the text if given, and calls `onOpened` once the box is done opening
 * (its frame drawn: see expand-button in the CSS).
 *
 * Accessibility: the text is in the DOM from the start (only visually hidden while the gauge runs), so
 * screen readers read it in place; the gauge is decorative and pauses while out of view. Open, the box
 * can be focused while its content scrolls (WCAG 2.1.1: keyboard users can scroll it then), and only
 * then: content that fits needs no stop on the way. Without
 * JavaScript the text is shown open (see the `scripting` media query in the CSS).
 */
export default function ExpandableContent({ text, children, onOpened, className }: ExpandableContentProps) {
  const boxRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  /** Open, its content overflows the box (and scrolls) */
  const [scrollable, setScrollable] = useState(false);
  const [inView, setInView] = useState(false);
  const [open, setOpen] = useState(false);
  /** The gauge's count hit 100%: the corner brackets blink along with it */
  const [full, setFull] = useState(false);

  useEffect(() => {
    const box = boxRef.current;
    if (!box || open) {
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => setInView(entry.isIntersecting),
      { threshold: IN_VIEW_THRESHOLD }
    );
    observer.observe(box);

    return () => observer.disconnect();
  }, [open]);

  // Open, whether the content overflows, again as it or what's in it resizes (two levels down: children
  // fill the box, and what grows is in them)
  useEffect(() => {
    const content = contentRef.current;
    if (!content || !open) {
      return;
    }
    const measure = () => setScrollable(content.scrollHeight > content.clientHeight);
    measure();

    if (typeof ResizeObserver === "undefined") {
      return;
    }
    const resizeObserver = new ResizeObserver(measure);
    const children = Array.from(content.children);
    const grandchildren = children.flatMap((child) => Array.from(child.children));
    [content, ...children, ...grandchildren].forEach((element) => resizeObserver.observe(element));
    return () => resizeObserver.disconnect();
  }, [open]);

  /** The count hit 100%: the brackets blink with it. Then, once it has blinked, the box opens */
  const handleGaugeFull = () => setFull(true);
  const handleGaugeComplete = () => setOpen(true);
  /** The frame's drawing ends the opening (the keyframes' name is scoped by the CSS module) */
  const handleContentAnimationEnd = ({ target, currentTarget, animationName }: AnimationEvent) => {
    if (target === currentTarget && animationName.endsWith("expand-button")) {
      onOpened?.();
    }
  };

  return (
    <div className={classNames(styles.container, className)}>
      <div ref={boxRef} className={styles.box} data-open={open}>
        <AboutTargetIcon open={open} blink={full} running={inView} />
        <Gauge
          className={styles.gauge}
          running={inView}
          onFull={handleGaugeFull}
          onComplete={handleGaugeComplete}
        />
        {/* Focusable while it scrolls, so keyboard users can scroll it (WCAG 2.1.1) */}
        <div
          ref={contentRef}
          className={styles.content}
          data-open={open}
          tabIndex={open && scrollable ? 0 : undefined}
          onAnimationEnd={handleContentAnimationEnd}
        >
          {children ?? <p>{text}</p>}
        </div>
        <AboutTargetIcon bottom open={open} blink={full} running={inView} />
      </div>
    </div>
  );
}
