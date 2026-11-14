"use client";

import { CSSProperties, useEffect, useId, useRef, useState } from "react";
import { SKILLS, SKILL_MAX_SEGMENTS } from "@constants/skills";
import { SkillBarsProps } from "@constants/interfaces";
import styles from "./SkillBars.module.css";
import classNames from "@utils/classNames";

/** How much of the list must be visible for the bars to fill */
const IN_VIEW_THRESHOLD = 0.5;

/**
 * The skills, one per row: a name and a pill-shaped bar of SKILL_MAX_SEGMENTS segments, painted red
 * to purple to white along the full scale. Once in view, each bar fills segment by segment up to the
 * skill's value, the rows one after the other. The rows share the list's height: what's left goes
 * into the gaps between them.
 *
 * Accessibility: each bar is a meter named by its skill, valued in percent. The fill lasts under 5
 * seconds (WCAG 2.2.2); with reduced motion it completes instantly (see globals.css). Without
 * JavaScript the bars are shown full (see the `scripting` media query in the CSS).
 */
export default function SkillBars({ className }: SkillBarsProps) {
  const listRef = useRef<HTMLUListElement>(null);
  const [filling, setFilling] = useState(false);
  /** Escape hides the segments' tooltips until the pointer moves (WCAG 1.4.13) */
  const [tooltipsHidden, setTooltipsHidden] = useState(false);
  const id = useId();
  const skills = Object.entries(SKILLS);

  useEffect(() => {
    const list = listRef.current;
    if (!list || filling) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setFilling(true);
      },
      { threshold: IN_VIEW_THRESHOLD }
    );
    observer.observe(list);

    return () => observer.disconnect();
  }, [filling]);

  useEffect(() => {
    const handleKeyDown = ({ key }: KeyboardEvent) => {
      if (key === "Escape") setTooltipsHidden(true);
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  return (
    <ul
      ref={listRef}
      dir="ltr"
      data-tooltips-hidden={tooltipsHidden}
      onPointerMove={() => setTooltipsHidden(false)}
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
              <div className={styles.segments} data-filling={filling}>
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
