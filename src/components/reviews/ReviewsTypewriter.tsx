"use client";

import { CSSProperties, useEffect, useLayoutEffect, useRef, useState } from "react";
import classNames from "@utils/classNames";
import ExpandableContent from "@ui/expandableContent/ExpandableContent";
import Timestamp from "@components/reviews/Timestamp";
import usePrefersReducedMotion from "@hooks/usePrefersReducedMotion";
import useTypewriter, { TYPEWRITER_CLEAR_MS } from "@hooks/useTypewriter";
import { ReviewsTypewriterProps } from "@constants/interfaces";
import styles from "./ReviewsTypewriter.module.css";

/** How much of the list must be visible for the typing to run */
const IN_VIEW_THRESHOLD = 0.4;

/** The most the fade at the top of the quotes' box takes, in rem: less when the quote being typed would
 * reach into it, so that quote is always clear of it (see .box in the CSS) */
const FADE_REM = 3;

/**
 * Puts the quote at `index` in the vertical middle of the box (moving the list), and ends the box's
 * fade where that quote starts, `fade` px at most
 */
function centerQuote(box: HTMLElement, list: HTMLElement, index: number, fade: number) {
  const item = list.children[index] as HTMLElement | undefined;
  if (!item) {
    return;
  }
  // Where the quote is in the box, unmoved: the list is positioned, so the quote's offset is from it (and
  // the list's own, from the box, leaves its move out)
  const top = list.offsetTop + item.offsetTop;
  const shift = box.clientHeight / 2 - (top + item.offsetHeight / 2);
  list.style.transform = `translateY(${shift.toFixed(1)}px)`;
  const above = top + shift;
  box.style.setProperty("--typewriter-fade", `${Math.max(0, Math.min(fade, above)).toFixed(1)}px`);
}

/**
 * Quotes typed out one after another (see useTypewriter), in an expandable box (see ExpandableContent,
 * as in About): letter by letter, as on a computer, by a blinking cursor; once one is done, after a
 * pause, the next one starts under it. The quote being typed is kept in the vertical middle of the
 * list's box, pushing the ones before it up (they fade out at its top). Each quote's place is kept for
 * its whole text from the start (the rest of it is there, invisible), so it doesn't move as its lines
 * fill. Once the last one is typed, they all stay for a while, then disappear, and after a moment the
 * typing starts over.
 *
 * Under the quotes, `below` (e.g. an illustration) on the left, `source` in the middle, and on the
 * right the time since the box opened (see Timestamp).
 *
 * A button at the top pauses it all and plays it again (WCAG 2.2.2: it would otherwise go on
 * endlessly): the typing and its cursor, the timer, and `below`'s animations (see [data-paused] in the
 * CSS).
 *
 * The quotes' box is at least as tall as the tallest quote (with large text or wider spacing, WCAG
 * 1.4.4 / 1.4.12, the open box then scrolls rather than cut it), and its fade never covers the quote
 * being typed.
 *
 * It starts once the box is done opening, and types only while in view, holding where it is otherwise.
 * With reduced motion, all the quotes are shown at once, typed, and stay. Screen readers read each
 * quote whole, in place: the typed copy is hidden from them.
 */
export default function ReviewsTypewriter({ quotes, label, className, below, source }: ReviewsTypewriterProps) {
  const boxRef = useRef<HTMLDivElement>(null);
  const listRef = useRef<HTMLUListElement>(null);
  const reducedMotion = usePrefersReducedMotion();
  const [inView, setInView] = useState(false);
  /** When the expandable box was done opening (the clock's time), or null before */
  const [openedAt, setOpenedAt] = useState<number | null>(null);
  const opened = openedAt !== null;
  /** Paused with the button: the typing, the timer and the animations */
  const [paused, setPaused] = useState(false);

  const { current, typed, cleared, done } = useTypewriter(
    quotes,
    opened && inView && !reducedMotion && !paused
  );
  /** The quote being typed, for the box's resizes (see below) */
  const currentRef = useRef(current);
  /** The fade's most, in px (FADE_REM), measured with the box */
  const fadeRef = useRef(0);

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

  // As the box or its quotes resize (the screen's height, their lines rewrapping): at least as tall as
  // the tallest quote, and the quote being typed centered again
  useLayoutEffect(() => {
    const box = boxRef.current;
    const list = listRef.current;
    if (!box || !list) {
      return;
    }
    // With reduced motion the quotes are all shown, in place (they may have been laid out before the
    // preference was read: on hydrating, it's taken as false)
    if (reducedMotion) {
      list.style.transform = "";
      box.style.minHeight = "";
      return;
    }

    const fit = () => {
      const { paddingTop, paddingBottom } = getComputedStyle(box);
      const tallest = Math.max(...Array.from(list.children, (item) => (item as HTMLElement).offsetHeight));
      const minHeight = `${Math.ceil(tallest + parseFloat(paddingTop) + parseFloat(paddingBottom))}px`;
      if (box.style.minHeight !== minHeight) {
        box.style.minHeight = minHeight;
      }
      fadeRef.current = FADE_REM * parseFloat(getComputedStyle(document.documentElement).fontSize);
      centerQuote(box, list, currentRef.current, fadeRef.current);
    };
    fit();

    const resizeObserver = typeof ResizeObserver === "undefined" ? null : new ResizeObserver(fit);
    resizeObserver?.observe(box);
    resizeObserver?.observe(list);
    return () => resizeObserver?.disconnect();
  }, [reducedMotion]);

  // Each new quote centered, the list gliding up to it; starting over, the list jumps back, unseen (it's
  // empty), rather than gliding down
  useLayoutEffect(() => {
    currentRef.current = current;
    const box = boxRef.current;
    const list = listRef.current;
    if (!box || !list || reducedMotion) {
      return;
    }
    list.style.transition = current === 0 ? "none" : "";
    centerQuote(box, list, current, fadeRef.current);
  }, [current, reducedMotion]);

  return (
    <ExpandableContent className={className} onOpened={() => setOpenedAt(Date.now())}>
      {/* Left to right on every locale's page, as the quotes are in English */}
      <div dir="ltr" data-paused={paused || undefined} className={styles.layout}>
        {/* The rows over and under the quotes are hidden until the box is done opening (keeping their
         * place, so the quotes don't move). The button is in English, as the readouts are */}
        <div className={classNames(styles.top, styles.untilOpened)} data-hidden={!opened || undefined}>
          <button type="button" lang="en" className={styles.pause} onClick={() => setPaused(!paused)}>
            <span aria-hidden className={styles.pauseIcon}>
              {paused ? "▶" : "❚❚"}
            </span>
            {paused ? "PLAY" : "PAUSE"}
          </button>
        </div>
        <div
          ref={boxRef}
          className={styles.box}
          data-static={reducedMotion || undefined}
          style={{ "--typewriter-fade-max": `${FADE_REM}rem` } as CSSProperties}
        >
          {/* The quotes are in English on every locale's page */}
          <ul
            ref={listRef}
            aria-label={label}
            lang="en"
            dir="ltr"
            data-cleared={cleared || undefined}
            className={styles.list}
            style={{ "--typewriter-clear": `${TYPEWRITER_CLEAR_MS}ms` } as CSSProperties}
          >
            {quotes.map((quote, index) => {
              const state = reducedMotion || index < current ? "typed" : index === current ? "typing" : "waiting";
              const shown = state === "typed" ? quote.length : state === "typing" ? typed : 0;

              return (
                <li key={index} data-state={state} className={styles.quote}>
                  <blockquote>
                    <p className="sr-only">{quote}</p>
                    <p aria-hidden className={styles.text}>
                      {quote.slice(0, shown)}
                      {state === "typing" && (
                        <span
                          className={classNames(styles.cursor, (done || !opened || paused) && styles.blinking)}
                        />
                      )}
                      <span className={styles.rest}>{quote.slice(shown)}</span>
                    </p>
                  </blockquote>
                </li>
              );
            })}
          </ul>
        </div>
        <div className={classNames(styles.bottom, styles.untilOpened)} data-hidden={!opened || undefined}>
          {below}
          {source && <span className={classNames(styles.readout, styles.source)}>{source}</span>}
          <Timestamp
            since={openedAt}
            paused={paused}
            className={classNames(styles.readout, styles.timestamp)}
          />
        </div>
      </div>
    </ExpandableContent>
  );
}
