"use client";

import { ReactNode, useEffect, useLayoutEffect, useRef, useState, useSyncExternalStore } from "react";
import classNames from "@utils/classNames";
import ExpandableContent from "@ui/expandableContent/ExpandableContent";
import styles from "./ReviewsTypewriter.module.css";

/** How long typing a letter takes: a base, plus up to as much again at random, as a person types */
const LETTER_MS = 30;
const LETTER_JITTER_MS = 30;
/** The pause once a quote is typed, before the next one starts */
const PAUSE_MS = 2000;
/** Once the last quote is typed: how long they all stay, how long they take to fade out (see .list in
 * the CSS), and how long the box stays empty before the typing starts over */
const LINGER_MS = 4000;
const CLEAR_MS = 300;
const EMPTY_MS = 2000;
/** How much of the list must be visible for the typing to run */
const IN_VIEW_THRESHOLD = 0.4;

const REDUCED_MOTION = "(prefers-reduced-motion: reduce)";

/** The most the fade at the top of the quotes' box takes (see .box in the CSS), in rem: less when the
 * quote being typed would reach into it, so that quote is always clear of it */
const FADE_REM = 3;

/** How many seconds the timestamp counts up to (99:59) before it starts over from 00:00 */
const TIMESTAMP_CYCLE_SECONDS = 100 * 60;

/** The time since the box opened, as "TTI mm:ss", starting over from 00:00 after 99:59 */
const formatElapsed = (elapsedSeconds: number) => {
  const seconds = elapsedSeconds % TIMESTAMP_CYCLE_SECONDS;
  return `TTI ${String(Math.floor(seconds / 60)).padStart(2, "0")}:${String(seconds % 60).padStart(2, "0")}`;
};

/** Whether the user asks for reduced motion (false on the server, and without matchMedia) */
function usePrefersReducedMotion() {
  return useSyncExternalStore(
    (onChange) => {
      const query = window.matchMedia?.(REDUCED_MOTION);
      query?.addEventListener("change", onChange);
      return () => query?.removeEventListener("change", onChange);
    },
    () => !!window.matchMedia?.(REDUCED_MOTION).matches,
    () => false
  );
}

/**
 * Quotes typed out one after another, in an expandable box (see ExpandableContent, as in About): letter by letter, as on a computer: a blinking cursor types each
 * one, and once it's done, after a pause, the next one starts under it. The quote being typed is kept in
 * the vertical middle of the list's box, pushing the ones before it up (they fade out at its top). Each
 * quote's place is kept for its whole text from the start (the rest of it is there, invisible), so it
 * doesn't move as its lines fill.
 *
 * Under the quotes, `below` (e.g. an illustration) on the left, `source` in the middle, and on the right
 * the time since the box opened ("TTI 00:00", counting each second, starting over after 99:59).
 *
 * Once the last quote is typed, they all stay for a while, then disappear, and after a moment the typing
 * starts over from the first one, endlessly.
 *
 * A button at the top pauses it all, and plays it again (WCAG 2.2.2: the typing, the timer and the
 * animations would otherwise go on endlessly): the typing and its cursor, the timer (which, played
 * again, shows the time since the box opened), and `below`'s animations (paused along with
 * [data-paused], see the CSS).
 *
 * The quotes' box is at least tall enough for the tallest quote (with large text or wider spacing,
 * WCAG 1.4.4 / 1.4.12, the open box then scrolls rather than cut it), and its fade at the top never
 * covers the quote being typed.
 *
 * It starts once the box is done opening, and types only while in view, pausing where it is otherwise.
 * With reduced motion, all the quotes are shown at once, typed, and stay. Screen readers read each quote whole, in place: the typed copy is hidden from
 * them.
 */
export default function ReviewsTypewriter({
  quotes,
  label,
  className,
  below,
  source,
}: {
  quotes: readonly string[];
  label: string;
  /** Sizes and places the expandable box's container */
  className?: string;
  /** Shown in the box under the quotes, on the left (e.g. an illustration) */
  below?: ReactNode;
  /** Shown under the quotes in the middle, in the timestamp's style: where they come from */
  source?: ReactNode;
}) {
  const boxRef = useRef<HTMLDivElement>(null);
  const listRef = useRef<HTMLUListElement>(null);
  const [inView, setInView] = useState(false);
  /** The expandable box is done opening */
  const [opened, setOpened] = useState(false);
  const reducedMotion = usePrefersReducedMotion();
  /** The quotes have disappeared, before the typing starts over */
  const [cleared, setCleared] = useState(false);
  /** Whole seconds since the box opened */
  const [elapsed, setElapsed] = useState(0);
  /** When the box opened (the clock's time) */
  const openedAtRef = useRef(0);
  /** Paused with the button: the typing, the timer and the animations */
  const [paused, setPaused] = useState(false);

  const handleOpened = () => {
    openedAtRef.current = Date.now();
    setOpened(true);
  };

  // The time since the box opened, from the clock (timers drift), each second, unless paused
  useEffect(() => {
    if (!opened || paused) {
      return;
    }
    const tick = () => setElapsed(Math.floor((Date.now() - openedAtRef.current) / 1000));
    const interval = setInterval(tick, 1000);
    return () => clearInterval(interval);
  }, [opened, paused]);
  /** The quote being typed, and how many of its letters are typed */
  const [current, setCurrent] = useState(0);
  const [typed, setTyped] = useState(0);

  useEffect(() => {
    const box = boxRef.current;
    if (!box || reducedMotion) {
      return;
    }

    const observer = new IntersectionObserver(([entry]) => setInView(entry.isIntersecting), {
      threshold: IN_VIEW_THRESHOLD,
    });
    observer.observe(box);
    return () => observer.disconnect();
  }, [reducedMotion]);

  // The next letter; once the quote is typed, the next quote after the pause; once the last one is,
  // they all disappear after a while, and once they're gone, after a moment, the first one starts over
  useEffect(() => {
    if (!opened || !inView || reducedMotion || paused) {
      return;
    }

    const length = quotes[current]?.length ?? 0;
    let timeout: ReturnType<typeof setTimeout> | undefined;
    if (cleared) {
      timeout = setTimeout(() => {
        setCurrent(0);
        setTyped(0);
        setCleared(false);
      }, CLEAR_MS + EMPTY_MS);
    } else if (typed < length) {
      timeout = setTimeout(() => setTyped(typed + 1), LETTER_MS + Math.random() * LETTER_JITTER_MS);
    } else if (current < quotes.length - 1) {
      timeout = setTimeout(() => {
        setCurrent(current + 1);
        setTyped(0);
      }, PAUSE_MS);
    } else {
      timeout = setTimeout(() => setCleared(true), LINGER_MS);
    }
    return () => clearTimeout(timeout);
  }, [opened, inView, reducedMotion, paused, quotes, current, typed, cleared]);

  // The quote being typed, in the box's vertical middle: the list moves up for each new one
  useLayoutEffect(() => {
    const box = boxRef.current;
    const list = listRef.current;
    if (!box || !list) {
      return;
    }
    // With reduced motion the quotes are all shown, in place (it may have been centered before the
    // preference was read: on hydrating, it's taken as false)
    if (reducedMotion) {
      list.style.transform = "";
      box.style.minHeight = "";
      return;
    }

    // Starting over, the list jumps back, unseen (it's empty), rather than gliding down
    list.style.transition = current === 0 ? "none" : "";
    const center = () => {
      // Tall enough for the tallest quote
      const items = Array.from(list.children as HTMLCollectionOf<HTMLElement>);
      const { paddingTop, paddingBottom } = getComputedStyle(box);
      const minHeight = `${Math.ceil(
        Math.max(...items.map(({ offsetHeight }) => offsetHeight)) +
          parseFloat(paddingTop) +
          parseFloat(paddingBottom)
      )}px`;
      if (box.style.minHeight !== minHeight) {
        box.style.minHeight = minHeight;
      }

      const item = items[current];
      if (item) {
        const shift = box.clientHeight / 2 - (item.offsetTop + item.offsetHeight / 2);
        list.style.transform = `translateY(${shift.toFixed(1)}px)`;
        // The fade ends where the quote starts, at most
        const fade = FADE_REM * parseFloat(getComputedStyle(document.documentElement).fontSize);
        const above = item.offsetTop + shift;
        box.style.setProperty("--typewriter-fade", `${Math.max(0, Math.min(fade, above)).toFixed(1)}px`);
      }
    };
    center();

    // Its lines rewrap as the box's width changes, and its height follows the screen's
    const resizeObserver = typeof ResizeObserver === "undefined" ? null : new ResizeObserver(center);
    resizeObserver?.observe(box);
    resizeObserver?.observe(list);
    return () => resizeObserver?.disconnect();
  }, [current, reducedMotion]);

  const done = typed >= (quotes[current]?.length ?? 0);

  return (
    <ExpandableContent className={className} onOpened={handleOpened}>
      {/* Left to right on every locale's page, as the quotes are in English */}
      <div dir="ltr" data-paused={paused || undefined} className={styles.layout}>
        {/* Hidden until the box is done opening, like the row under the quotes. In English, as the
         * readouts are */}
        <div className={styles.top} data-hidden={!opened || undefined}>
          <button type="button" lang="en" className={styles.pause} onClick={() => setPaused(!paused)}>
            <span aria-hidden className={styles.pauseIcon}>
              {paused ? "▶" : "❚❚"}
            </span>
            {paused ? "PLAY" : "PAUSE"}
          </button>
        </div>
        <div ref={boxRef} className={styles.box} data-static={reducedMotion || undefined}>
          {/* The quotes are in English on every locale's page */}
          <ul
            ref={listRef}
            aria-label={label}
            lang="en"
            dir="ltr"
            data-cleared={cleared || undefined}
            className={styles.list}
          >
            {quotes.map((quote, index) => {
              const state = reducedMotion || index < current ? "typed" : index === current ? "typing" : "waiting";
              const shown = state === "typed" ? quote.length : state === "typing" ? typed : 0;

              return (
                <li key={index} data-state={state} className={styles.quote}>
                  <blockquote>
                    <p className={styles.srOnly}>{quote}</p>
                    <p aria-hidden className={styles.text}>
                      {quote.slice(0, shown)}
                      {state === "typing" && (
                        <span className={classNames(styles.cursor, (done || !opened || paused) && styles.blinking)} />
                      )}
                      <span className={styles.rest}>{quote.slice(shown)}</span>
                    </p>
                  </blockquote>
                </li>
              );
            })}
          </ul>
        </div>
        {/* Hidden until the box is done opening (keeping its place, so the quotes don't move) */}
        <div className={styles.bottom} data-hidden={!opened || undefined}>
          {below}
          {source && <span className={classNames(styles.readout, styles.source)}>{source}</span>}
          {/* A decorative readout: screen readers would only hear it tick */}
          <span aria-hidden className={classNames(styles.readout, styles.timestamp)}>
            {formatElapsed(elapsed)}
          </span>
        </div>
      </div>
    </ExpandableContent>
  );
}
