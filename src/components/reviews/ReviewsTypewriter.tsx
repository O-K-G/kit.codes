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

  // The time since the box opened, from the clock (timers drift), each second
  useEffect(() => {
    if (!opened) {
      return;
    }
    const openedAt = Date.now();
    const interval = setInterval(() => setElapsed(Math.floor((Date.now() - openedAt) / 1000)), 1000);
    return () => clearInterval(interval);
  }, [opened]);
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
    if (!opened || !inView || reducedMotion) {
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
  }, [opened, inView, reducedMotion, quotes, current, typed, cleared]);

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
      return;
    }

    // Starting over, the list jumps back, unseen (it's empty), rather than gliding down
    list.style.transition = current === 0 ? "none" : "";
    const center = () => {
      const item = list.children[current] as HTMLElement | undefined;
      if (item) {
        const shift = box.clientHeight / 2 - (item.offsetTop + item.offsetHeight / 2);
        list.style.transform = `translateY(${shift.toFixed(1)}px)`;
      }
    };
    center();

    // Its lines rewrap as the box's width changes
    const resizeObserver = typeof ResizeObserver === "undefined" ? null : new ResizeObserver(center);
    resizeObserver?.observe(box);
    return () => resizeObserver?.disconnect();
  }, [current, reducedMotion]);

  const done = typed >= (quotes[current]?.length ?? 0);

  return (
    <ExpandableContent className={className} onOpened={() => setOpened(true)}>
      {/* Left to right on every locale's page, as the quotes are in English */}
      <div dir="ltr" className={styles.layout}>
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
                        <span className={classNames(styles.cursor, (done || !opened) && styles.blinking)} />
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
