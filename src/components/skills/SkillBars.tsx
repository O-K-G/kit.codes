"use client";

import { CSSProperties, useEffect, useId, useRef, useState } from "react";
import { SKILLS, SKILL_MAX_SEGMENTS } from "@constants/skills";
import { SkillBarsProps } from "@constants/interfaces";
import styles from "./SkillBars.module.css";
import classNames from "@utils/classNames";

/** How much of the list must be visible for the bars to fill */
const IN_VIEW_THRESHOLD = 0.5;

/** The rows start filling one after another, this far apart */
const ROW_DELAY_MS = 80;

/**
 * The skills, one per row: a name and a pill-shaped bar of SKILL_MAX_SEGMENTS segments, painted red
 * to purple to white along the full scale. Once in view, each bar fills segment by segment up to the
 * skill's value, the rows one after the other. The rows share the list's height: what's left goes
 * into the gaps between them.
 *
 * Each row's animations start at its turn (rather than all at once, with delays), so the browser starts
 * a few dozen at a time instead of several hundred as the list comes into view.
 *
 * Accessibility: each bar is a meter named by its skill, valued in percent. The fill lasts under 5
 * seconds (WCAG 2.2.2); with reduced motion it completes instantly, every row at once (see globals.css).
 * Without JavaScript the bars are shown full (see the `scripting` media query in the CSS).
 */
export default function SkillBars({ className }: SkillBarsProps) {
  const listRef = useRef<HTMLUListElement>(null);
  /** How many rows have started filling (in order) */
  const [filledRows, setFilledRows] = useState(0);
  /** Escape hides the segments' tooltips until the pointer moves (WCAG 1.4.13) */
  const [tooltipsHidden, setTooltipsHidden] = useState(false);
  const id = useId();
  const skills = Object.entries(SKILLS);

  useEffect(() => {
    const list = listRef.current;
    if (!list) {
      return;
    }

    let timer: ReturnType<typeof setInterval> | undefined;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) {
          return;
        }
        observer.disconnect();

        if (matchMedia("(prefers-reduced-motion: reduce)").matches) {
          setFilledRows(skills.length);
          return;
        }

        let started = 1;
        setFilledRows(started);
        timer = setInterval(() => {
          started += 1;
          setFilledRows(started);
          if (started >= skills.length) {
            clearInterval(timer);
          }
        }, ROW_DELAY_MS);
      },
      { threshold: IN_VIEW_THRESHOLD }
    );
    observer.observe(list);

    return () => {
      observer.disconnect();
      clearInterval(timer);
    };
  }, [skills.length]);

  useEffect(() => {
    const handleKeyDown = ({ key }: KeyboardEvent) => {
      if (key === "Escape") {
        setTooltipsHidden(true);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  /** Moving the pointer brings the tooltips back */
  const handlePointerMove = () => setTooltipsHidden(false);

  return (
    <ul
      ref={listRef}
      dir="ltr"
      data-tooltips-hidden={tooltipsHidden}
      onPointerMove={handlePointerMove}
      className={classNames(styles.list, className)}
      style={
        {
          "--count": skills.length,
          "--segments": SKILL_MAX_SEGMENTS,
        } as CSSProperties
      }
    >
      {skills.map(([name, level], index) => {
        const labelId = `${id}-skill-${index}`;

        return (
          <li
            key={name}
            className={styles.skill}
            style={{ "--level": level, "--index": index } as CSSProperties}
          >
            <span id={labelId} className={styles.name}>
              {name}
            </span>
            <div
              role="meter"
              aria-labelledby={labelId}
              aria-valuemin={0}
              aria-valuemax={100}
              aria-valuenow={Math.round((level / SKILL_MAX_SEGMENTS) * 100)}
              aria-valuetext={`${Math.round((level / SKILL_MAX_SEGMENTS) * 100)}%`}
              className={styles.bar}
            >
              <div className={styles.segments} data-filling={index < filledRows}>
                {Array.from({ length: SKILL_MAX_SEGMENTS }, (_, segment) => (
                  <span
                    key={segment}
                    data-on={segment < level}
                    data-percent={Math.round(((segment + 1) / SKILL_MAX_SEGMENTS) * 100)}
                    style={{ "--segment": segment } as CSSProperties}
                  />
                ))}
              </div>
            </div>
          </li>
        );
      })}
    </ul>
  );
}
