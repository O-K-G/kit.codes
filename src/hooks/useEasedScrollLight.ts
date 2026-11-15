import { RefObject, useEffect } from "react";

/** How fast the light catches up with the scroll: an exponential ease, closing all but 1/e of the
 * distance in this many seconds */
const EASE_SECONDS = 0.25;

/** Closer than this to the scroll (in px), the light stops easing and settles on it */
const SETTLED_PX = 0.5;

/** Where a circle lights up, along its height: from its top third, fully lit by its center */
const NODE_LIGHT_START = 0.3;
const NODE_LIGHT_END = 0.5;

/** The class names of the timeline's parts, from its CSS module */
interface TimelineLightClasses {
  /** A branch's light and glow layers (see Timeline's Lines), and its part of the axis in them */
  light: string;
  glow: string;
  axisPart: string;
  /** A branch's circle */
  node: string;
}

/** A part of the axis (its light's, or its glow's), in page coordinates: its top, its bottom and width */
interface AxisPart {
  top: number;
  bottom: number;
  width: number;
}

/** A branch: its part of the axis, in its light and glow layers, and where its circle lights */
interface Branch {
  element: HTMLElement;
  light: AxisPart;
  glow: AxisPart;
  nodeStart: number;
  nodeEnd: number;
}

/**
 * How far a part's light is moved up (see .axisPart::before, which is the part's length and its round
 * end longer), in px, for its round end to be at the light's front: all the way up (hidden above the
 * part) before the front reaches it, not moved once it's past. Every part's round end is at the front,
 * so as the front passes from a part to the next, the round end shows half in each, whole.
 */
const shift = ({ top, bottom, width }: AxisPart, front: number) =>
  `${Math.min(Math.max(front - bottom, top - bottom - width / 2 - 2), 0).toFixed(2)}px`;

const unit = (value: number) => Math.min(Math.max(value, 0), 1).toFixed(4);

/**
 * Lights the timeline as the page scrolls (in place of its CSS scroll-driven animations, see
 * Timeline.module.css), following the scroll eased rather than exactly: a mouse wheel scrolls in steps,
 * and the light would jump with each. A virtual middle of the screen eases toward the real one on each
 * frame while they differ: the light's front. From it, each branch (the list's children) gets
 * --light-shift and --glow-shift (how far its part of the axis' light and glow are moved up, see
 * shift()) and --node-progress (how lit its circle and line are, from 0 to 1).
 *
 * The branches are measured once, and again when the list's size changes, not while scrolling: each
 * frame only sets those two properties, which the CSS turns into transforms and opacity. The list gets
 * data-smooth while this runs. With reduced motion it doesn't: the CSS leaves the timeline all lit.
 */
export default function useEasedScrollLight(
  listRef: RefObject<HTMLElement | null>,
  { light, glow, axisPart, node }: TimelineLightClasses
) {
  useEffect(() => {
    const list = listRef.current;
    if (!list || window.matchMedia?.("(prefers-reduced-motion: reduce)").matches) {
      return;
    }

    let branches: Branch[] = [];
    const measure = () => {
      const inPage = (rect?: DOMRect) =>
        rect && { top: rect.top + window.scrollY, bottom: rect.bottom + window.scrollY, width: rect.width };

      branches = Array.from(list.children as HTMLCollectionOf<HTMLElement>).flatMap((element) => {
        const lightPart = inPage(element.querySelector(`.${light} .${axisPart}`)?.getBoundingClientRect());
        const glowPart = inPage(element.querySelector(`.${glow} .${axisPart}`)?.getBoundingClientRect());
        const circle = inPage(element.querySelector(`.${node}`)?.getBoundingClientRect());
        if (!lightPart || !glowPart || !circle) {
          return [];
        }

        const circleHeight = circle.bottom - circle.top;
        return {
          element,
          light: lightPart,
          glow: glowPart,
          nodeStart: circle.top + NODE_LIGHT_START * circleHeight,
          nodeEnd: circle.top + NODE_LIGHT_END * circleHeight,
        };
      });
    };

    const middle = () => window.scrollY + window.innerHeight / 2;
    let eased = middle();

    const apply = () =>
      branches.forEach(({ element, light: lightPart, glow: glowPart, nodeStart, nodeEnd }) => {
        element.style.setProperty("--light-shift", shift(lightPart, eased));
        element.style.setProperty("--glow-shift", shift(glowPart, eased));
        element.style.setProperty("--node-progress", unit((eased - nodeStart) / (nodeEnd - nodeStart)));
      });

    let frame = 0;
    let lastTime = 0;
    const step = (time: number) => {
      const seconds = lastTime ? (time - lastTime) / 1000 : 1 / 60;
      lastTime = time;
      const target = middle();
      eased += (target - eased) * (1 - Math.exp(-seconds / EASE_SECONDS));

      if (Math.abs(target - eased) < SETTLED_PX) {
        eased = target;
        frame = 0;
        lastTime = 0;
      } else {
        frame = requestAnimationFrame(step);
      }
      apply();
    };
    const ease = () => {
      if (!frame) {
        frame = requestAnimationFrame(step);
      }
    };
    const remeasure = () => {
      measure();
      apply();
      ease();
    };

    measure();
    apply();
    list.dataset.smooth = "";

    window.addEventListener("scroll", ease, { passive: true });
    window.addEventListener("resize", remeasure);
    // Its branches move without the window's size changing too (fonts loading, text wrapping)
    const resizeObserver = typeof ResizeObserver === "undefined" ? null : new ResizeObserver(remeasure);
    resizeObserver?.observe(list);

    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("scroll", ease);
      window.removeEventListener("resize", remeasure);
      resizeObserver?.disconnect();
      delete list.dataset.smooth;
      branches.forEach(({ element }) => {
        ["--light-shift", "--glow-shift", "--node-progress"].forEach((name) => element.style.removeProperty(name));
      });
    };
  }, [listRef, light, glow, axisPart, node]);
}
