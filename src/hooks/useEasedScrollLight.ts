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

/** A part of the axis (its light's, or its glow's), in page coordinates: its top, its bottom and width;
 * and how far its light reaches above it, so it can slide past it (see shift()) */
interface AxisPart {
  top: number;
  bottom: number;
  width: number;
  reach: number;
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
 * How far a part's light is moved (see .axisPart::before: its round end, with its white tip, is half
 * the axis' width past the part's bottom, and it reaches above the part), in px, for its round end to
 * be at the light's front: all the way up (hidden above the part) before the front reaches it, and
 * down past the part (its white tip clipped away below it) once the front is past. Every part's round
 * end is at the front, so as the front passes from a part to the next, the round end shows half in
 * each, whole.
 */
const shift = ({ top, bottom, width, reach }: AxisPart, front: number) =>
  `${Math.min(Math.max(front - bottom, top - bottom - width / 2 - 2), reach).toFixed(2)}px`;

const unit = (value: number) => Math.min(Math.max(value, 0), 1).toFixed(4);

/**
 * Lights the timeline as the page scrolls (in place of its CSS scroll-driven animations, see
 * Timeline.module.css), following the scroll eased rather than exactly: a mouse wheel scrolls in steps,
 * and the light would jump with each. A virtual middle of the screen eases toward the real one on each
 * frame while they differ: the light's front. From it, each branch (the list's children) gets
 * --light-shift and --glow-shift (how far its part of the axis' light and glow are moved up, see
 * shift()) and --node-progress (how lit its circle and line are, from 0 to 1); and the list gets
 * --tip-y and --tip-opacity (where the light's blurry white tip is, from the list's top, and how much
 * it shows: fading in and out at the axis' ends).
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
    /** In page coordinates: the list's top, and where the axis' light runs */
    let listTop = 0;
    let axisStart = 0;
    let axisEnd = 0;
    let axisWidth = 1;
    const measure = () => {
      const inPage = (element: Element | null) => {
        if (!element) {
          return null;
        }
        const rect = element.getBoundingClientRect();
        return {
          top: rect.top + window.scrollY,
          bottom: rect.bottom + window.scrollY,
          width: rect.width,
          reach: -parseFloat(getComputedStyle(element, "::before").top) || 0,
        };
      };

      branches = Array.from(list.children as HTMLCollectionOf<HTMLElement>).flatMap((element) => {
        const lightPart = inPage(element.querySelector(`.${light} .${axisPart}`));
        const glowPart = inPage(element.querySelector(`.${glow} .${axisPart}`));
        const circle = inPage(element.querySelector(`.${node}`));
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

      listTop = list.getBoundingClientRect().top + window.scrollY;
      if (branches.length) {
        axisStart = branches[0].light.top;
        axisEnd = branches[branches.length - 1].light.bottom;
        axisWidth = branches[0].light.width || 1;
      }
    };

    const middle = () => window.scrollY + window.innerHeight / 2;
    let eased = middle();

    const apply = () => {
      branches.forEach(({ element, light: lightPart, glow: glowPart, nodeStart, nodeEnd }) => {
        element.style.setProperty("--light-shift", shift(lightPart, eased));
        element.style.setProperty("--glow-shift", shift(glowPart, eased));
        element.style.setProperty("--node-progress", unit((eased - nodeStart) / (nodeEnd - nodeStart)));
      });
      list.style.setProperty("--tip-y", `${(eased - listTop).toFixed(2)}px`);
      list.style.setProperty(
        "--tip-opacity",
        unit(Math.min((eased - axisStart) / axisWidth, (axisEnd - eased) / axisWidth))
      );
    };

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

    // First, so the parts are measured as the script lights them (see Timeline.module.css)
    list.dataset.smooth = "";
    measure();
    apply();

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
      ["--tip-y", "--tip-opacity"].forEach((name) => list.style.removeProperty(name));
      branches.forEach(({ element }) => {
        ["--light-shift", "--glow-shift", "--node-progress"].forEach((name) => element.style.removeProperty(name));
      });
    };
  }, [listRef, light, glow, axisPart, node]);
}
