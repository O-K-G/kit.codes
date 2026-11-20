"use client";

import { CSSProperties, PointerEvent, useEffect, useId, useRef, useState } from "react";
import {
  SKILL_GROUPS,
  SKILL_MAX_SEGMENTS,
  SKILL_SHORT_NAMES,
  skillChevrons,
  skillSegments,
} from "@constants/skills";
import { SkillBarsProps } from "@constants/interfaces";
import styles from "./SkillBars.module.css";
import classNames from "@utils/classNames";
import Tooltip from "@ui/tooltip/Tooltip";
import usePrefersReducedMotion from "@hooks/usePrefersReducedMotion";
import useRevealed from "@hooks/useRevealed";

/** How much of the list must be visible for the bars to fill */
const IN_VIEW_THRESHOLD = 0.5;

/** The rows start filling one after another, this far apart */
const ROW_DELAY_MS = 80;

/** The bars' mask (see the CSS, .segments), for bars of this size: the chevrons (see skillChevrons),
 * as one SVG path, whose edges the browser smooths (gradients drawn into their shape wouldn't be) */
const chevronsMask = (width: number, height: number) => {
  const { tip, step, arm } = skillChevrons(width, height);
  const round = (value: number) => Math.round(value * 100) / 100;
  const [w, h, half] = [width, height, height / 2].map(round);
  const path = Array.from({ length: SKILL_MAX_SEGMENTS }, (_, i) => {
    const start = i * step;
    const [left, end, point, notch] = [start, start + arm, start + arm + tip, start + tip].map(round);
    return `M${left} 0H${end}L${point} ${half}L${end} ${h}H${left}L${notch} ${half}Z`;
  }).join("");
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${w} ${h}" preserveAspectRatio="none"><path d="${path}"/></svg>`;

  return `url("data:image/svg+xml,${encodeURIComponent(svg)}")`;
};

/** Where a segment sits on the full scale, in percent (shown in its tooltip) */
const segmentPercent = (segment: number) =>
  Math.round(((segment + 1) / SKILL_MAX_SEGMENTS) * 100);

interface SkillBarProps {
  name: string;
  /** Its level, in percent */
  percent: number;
  /** Whether its fill has started */
  filling: boolean;
  /** The id its name goes by, naming the meter */
  labelId: string;
}

/**
 * One skill: its name and its bar. The bar is drawn as a single element (see .segments), not one per
 * segment, so resizing the window doesn't have every segment laid out again. With a mouse, hovering a
 * lit segment lifts it and shows its place on the scale in a tooltip (see Tooltip): one highlight, put
 * where the pointer is. The bar's meter already tells its value, so the highlight is hidden from
 * assistive technologies.
 */
function SkillBar({ name, percent, filling, labelId }: SkillBarProps) {
  /** How many segments are lit */
  const level = skillSegments(percent);
  /** Its shorter name on phones, if it has one */
  const shortName = SKILL_SHORT_NAMES[name];
  /** The lit segment last hovered, and whether the pointer is still on it */
  const [hovered, setHovered] = useState<{ segment: number; active: boolean } | null>(null);

  const deactivate = () =>
    setHovered((current) => (current?.active ? { ...current, active: false } : current));

  const handlePointerMove = (event: PointerEvent<HTMLDivElement>) => {
    if (event.pointerType === "touch") {
      return;
    }
    // On the lifted segment or its tooltip (which can be hovered, WCAG 1.4.13): it stays
    if ((event.target as Element).closest(`.${styles.highlight}`)) {
      return;
    }

    // The chevrons slant: measured halfway into their point, each one starts a step after the last.
    // In a right-to-left page the bar is mirrored (see the CSS), so they're counted from its right
    const { left, right, width, height } = event.currentTarget.getBoundingClientRect();
    const { tip, step, arm } = skillChevrons(width, height);
    const isRtl = event.currentTarget.closest("[dir]")?.getAttribute("dir") === "rtl";
    const x = (isRtl ? right - event.clientX : event.clientX - left) - tip / 2;
    const segment = Math.floor(x / step);
    const onSegment = segment >= 0 && segment < level && x - segment * step <= arm;

    if (onSegment) {
      setHovered((current) =>
        current?.active && current.segment === segment ? current : { segment, active: true }
      );
    } else {
      deactivate();
    }
  };

  return (
    <li className={styles.skill} style={{ "--level": level } as CSSProperties}>
      {/* With a short name, phones show it, and the full name only to screen readers: the meter is
        * always named by the full name. Isolated (bdi, dir="auto"), so in a right-to-left page an English
        * name keeps its brackets in place */}
      <span id={labelId} className={styles.name}>
        {shortName ? (
          <>
            <span className={styles.fullName} dir="auto">
              {name}
            </span>
            <span className={styles.shortName} dir="auto" aria-hidden>
              {shortName}
            </span>
          </>
        ) : (
          <bdi>{name}</bdi>
        )}
      </span>
      <div
        role="meter"
        aria-labelledby={labelId}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={percent}
        aria-valuetext={`${percent}%`}
        className={styles.bar}
      >
        <div
          className={styles.segments}
          data-filling={filling}
          onPointerMove={handlePointerMove}
          onPointerLeave={deactivate}
        >
          {/* The lit segments, in the reveal that sweeps them in (see .fill in the CSS) */}
          <span className={styles.fill}>
            <span className={styles.lit} />
          </span>
          {hovered && (
            <Tooltip
              // A new segment is a new highlight, so it lifts from its place rather than sliding there
              key={hovered.segment}
              aria-hidden
              open={hovered.active}
              content={`${segmentPercent(hovered.segment)}%`}
              data-active={hovered.active}
              className={styles.highlight}
              tooltipClassName={styles.tooltip}
              boxClassName={styles.tooltipBox}
              style={{ "--segment": hovered.segment } as CSSProperties}
            />
          )}
        </div>
      </div>
    </li>
  );
}

/**
 * The skills, in groups (see SKILL_GROUPS): each group's name, then its skills, one per row (see
 * SkillBar): a name and a pill-shaped bar of SKILL_MAX_SEGMENTS chevrons, painted white to purple to
 * yellow to red along the full scale. Once in view, each bar fills segment by segment up to the
 * skill's level, the rows one after the other, across the groups. Each group is framed by a rounded
 * border of its own color. The groups share the list's height and its columns (through subgrid), so
 * every bar lines up.
 *
 * Each row's fill starts at its turn (rather than all at once, with delays), so the browser doesn't
 * start every row's animation as the list comes into view.
 *
 * Accessibility: each group is a list headed by its name; each bar is a meter named by its skill,
 * valued in percent. The fill lasts under 5 seconds (WCAG 2.2.2); with reduced motion it completes
 * instantly, every row at once (see globals.css). Without JavaScript the bars are shown full (see the
 * `scripting` media query in the CSS).
 */
export default function SkillBars({ className, groupNames }: SkillBarsProps) {
  const listRef = useRef<HTMLDivElement>(null);
  /** How many rows have started filling (in order) */
  const [filledRows, setFilledRows] = useState(0);
  const id = useId();
  const reducedMotion = usePrefersReducedMotion();
  /** The page is in full view (the loader has faded out): the bars wait for it, to be seen */
  const revealed = useRevealed();

  /** Each group's skills, with their place among all the skills (their turn to fill) */
  let index = 0;
  const groups = SKILL_GROUPS.map(({ id: groupId, skills }) => ({
    groupId,
    skills: Object.entries(skills).map(([name, percent]) => ({ name, percent, index: index++ })),
  }));
  const skillCount = index;

  // The bars' chevrons, drawn for their size (they're all as big: they share the list's columns and
  // rows), again whenever it changes
  useEffect(() => {
    const list = listRef.current;
    const bar = list?.querySelector(`.${styles.segments}`);
    if (!list || !bar || typeof ResizeObserver === "undefined") {
      return;
    }

    // Redrawn only when the size changes by a whole pixel: the mask stretches to the bar, so smaller
    // changes (e.g. while the window is resized) don't need a new one
    let drawn = "";
    const resizeObserver = new ResizeObserver(([entry]) => {
      const { width, height } = entry.contentRect;
      const size = `${Math.round(width)}x${Math.round(height)}`;
      if (width > 0 && height > 0 && size !== drawn) {
        drawn = size;
        list.style.setProperty("--chevrons", chevronsMask(width, height));
      }
    });
    resizeObserver.observe(bar);

    return () => resizeObserver.disconnect();
  }, []);

  useEffect(() => {
    const list = listRef.current;
    if (!list || !revealed) {
      return;
    }

    let timer: ReturnType<typeof setInterval> | undefined;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) {
          return;
        }
        observer.disconnect();

        if (reducedMotion) {
          setFilledRows(skillCount);
          return;
        }

        let started = 1;
        setFilledRows(started);
        timer = setInterval(() => {
          started += 1;
          setFilledRows(started);
          if (started >= skillCount) {
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
  }, [skillCount, reducedMotion, revealed]);

  return (
    <div
      ref={listRef}
      className={classNames(styles.list, className)}
      style={
        {
          "--count": skillCount + groups.length,
          "--groups": groups.length,
          "--segments": SKILL_MAX_SEGMENTS,
        } as CSSProperties
      }
    >
      {groups.map(({ groupId, skills }) => (
        <div
          key={groupId}
          className={styles.group}
          data-group={groupId}
          style={{ "--rows": skills.length + 1 } as CSSProperties}
        >
          <h3 id={`${id}-${groupId}`} className={styles.groupName}>
            {groupNames[groupId]}
          </h3>
          <ul aria-labelledby={`${id}-${groupId}`} className={styles.skills}>
            {skills.map(({ name, percent, index: skillIndex }) => (
              <SkillBar
                key={name}
                name={name}
                percent={percent}
                filling={skillIndex < filledRows}
                labelId={`${id}-skill-${skillIndex}`}
              />
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
}
