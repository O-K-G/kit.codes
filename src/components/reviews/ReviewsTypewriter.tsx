"use client";

import { useEffect, useLayoutEffect, useRef, useState, useSyncExternalStore } from "react";
import classNames from "@utils/classNames";
import styles from "./ReviewsTypewriter.module.css";

/** How long typing a letter takes: a base, plus up to as much again at random, as a person types */
const LETTER_MS = 30;
const LETTER_JITTER_MS = 30;
/** The pause once a quote is typed, before the next one starts */
const PAUSE_MS = 2000;
/** How much of the list must be visible for the typing to run */
const IN_VIEW_THRESHOLD = 0.4;

const REDUCED_MOTION = "(prefers-reduced-motion: reduce)";

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
 * Quotes typed out one after another, letter by letter, as on a computer: a blinking cursor types each
 * one, and once it's done, after a pause, the next one starts under it. The quote being typed is kept in
 * the vertical middle of the list's box, pushing the ones before it up (they fade out at its top). Each
 * quote's place is kept for its whole text from the start (the rest of it is there, invisible), so it
 * doesn't move as its lines fill.
 *
 * It types only while in view, pausing where it is otherwise. With reduced motion, all the quotes are
 * shown at once, typed. Screen readers read each quote whole, in place: the typed copy is hidden from
 * them.
 */
export default function ReviewsTypewriter({ quotes, label }: { quotes: readonly string[]; label: string }) {
  const boxRef = useRef<HTMLDivElement>(null);
  const listRef = useRef<HTMLUListElement>(null);
  const [inView, setInView] = useState(false);
  const reducedMotion = usePrefersReducedMotion();
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

  // The next letter, or, once the quote is typed, the next quote after the pause
  useEffect(() => {
    if (!inView || reducedMotion) {
      return;
    }

    const length = quotes[current]?.length ?? 0;
    let timeout: ReturnType<typeof setTimeout> | undefined;
    if (typed < length) {
      timeout = setTimeout(() => setTyped(typed + 1), LETTER_MS + Math.random() * LETTER_JITTER_MS);
    } else if (current < quotes.length - 1) {
      timeout = setTimeout(() => {
        setCurrent(current + 1);
        setTyped(0);
      }, PAUSE_MS);
    }
    return () => clearTimeout(timeout);
  }, [inView, reducedMotion, quotes, current, typed]);

  // The quote being typed, in the box's vertical middle: the list moves up for each new one
  useLayoutEffect(() => {
    const box = boxRef.current;
    const list = listRef.current;
    if (!box || !list || reducedMotion) {
      return;
    }

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
    <div ref={boxRef} className={styles.box} data-static={reducedMotion || undefined}>
      {/* The quotes are in English on every locale's page */}
      <ul ref={listRef} aria-label={label} lang="en" dir="ltr" className={styles.list}>
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
                    <span className={classNames(styles.cursor, done && styles.blinking)} />
                  )}
                  <span className={styles.rest}>{quote.slice(shown)}</span>
                </p>
              </blockquote>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
