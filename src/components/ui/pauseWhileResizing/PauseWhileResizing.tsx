"use client";

import { useEffect } from "react";

/** The attribute set on <html> while the window is being resized (see globals.css) */
export const RESIZING_ATTRIBUTE = "data-resizing";

/** How long after the last size change the animations resume */
const RESUME_AFTER_MS = 250;

/** Pauses or resumes the page's SVG animations (<animate>), leaving the ones paused off screen paused */
function setSvgAnimationsPaused(paused: boolean) {
  document.querySelectorAll("svg").forEach((svg) => {
    if (paused) {
      svg.pauseAnimations();
    } else if (!svg.closest('[data-paused="true"]')) {
      svg.unpauseAnimations();
    }
  });
}

/**
 * While the window is being resized, pauses every animation on the page (CSS ones through
 * RESIZING_ATTRIBUTE, see globals.css, and SVG ones) and switches off the glows and blurs (see
 * globals.css), so the browser has less to draw at each step; it all comes back once the size has
 * settled. Transitions keep running: turning them off too measured no
 * faster, and the loader and the contact drawer wait for theirs to end.
 *
 * On touch screens, only width changes count (rotating, resizing a split screen): the height also
 * changes as the address bar slides in and out while scrolling, which mustn't stop the animations.
 */
export default function PauseWhileResizing() {
  useEffect(() => {
    const root = document.documentElement;
    const isTouch = matchMedia("(pointer: coarse)");
    let { innerWidth: width, innerHeight: height } = window;
    let timer: ReturnType<typeof setTimeout> | undefined;

    const resume = () => {
      timer = undefined;
      root.removeAttribute(RESIZING_ATTRIBUTE);
      setSvgAnimationsPaused(false);
    };

    const handleResize = () => {
      const widthChanged = window.innerWidth !== width;
      const heightChanged = window.innerHeight !== height;
      width = window.innerWidth;
      height = window.innerHeight;
      if (!widthChanged && (!heightChanged || isTouch.matches)) {
        return;
      }

      if (timer === undefined) {
        root.setAttribute(RESIZING_ATTRIBUTE, "");
        setSvgAnimationsPaused(true);
      } else {
        clearTimeout(timer);
      }
      timer = setTimeout(resume, RESUME_AFTER_MS);
    };

    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
      if (timer !== undefined) {
        clearTimeout(timer);
        resume();
      }
    };
  }, []);

  return null;
}
