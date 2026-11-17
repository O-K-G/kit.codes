"use client";

import { CSSProperties, PointerEvent, useEffect, useId, useRef, useState } from "react";
import { SKILL_GROUPS, SKILL_MAX_SEGMENTS, skillSegments } from "@constants/skills";
import { SkillBarsProps } from "@constants/interfaces";
import styles from "./SkillBars.module.css";
import classNames from "@utils/classNames";
import Tooltip from "@ui/tooltip/Tooltip";
import usePrefersReducedMotion from "@hooks/usePrefersReducedMotion";

/** How much of the list must be visible for the bars to fill */
const IN_VIEW_THRESHOLD = 0.5;

/** The rows start filling one after another, this far apart */
const ROW_DELAY_MS = 80;

/* A bar's segments, as fractions of its width (as in the CSS, see .segments): SKILL_MAX_SEGMENTS
 * segments, each followed by a gap of 30% of the width shared out between them (but the last) */
const SEGMENT_GAP = 0.3 / SKILL_MAX_SEGMENTS;
const SEGMENT_WIDTH = (1 - (SKILL_MAX_SEGMENTS - 1) * SEGMENT_GAP) / SKILL_MAX_SEGMENTS;
const SEGMENT_PITCH = SEGMENT_WIDTH + SEGMENT_GAP;

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

    const { left, width } = event.currentTarget.getBoundingClientRect();
    const x = (event.clientX - left) / width;
    const segment = Math.floor(x / SEGMENT_PITCH);
    const onSegment = segment >= 0 && segment < level && x - segment * SEGMENT_PITCH <= SEGMENT_WIDTH;

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
      <span id={labelId} className={styles.name}>
        {name}
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
 * SkillBar): a name and a pill-shaped bar of SKILL_MAX_SEGMENTS segments, painted red to purple to
 * white along the full scale. Once in view, each bar fills segment by segment up to the skill's level,
 * the rows one after the other, across the groups. Each group is framed by a rounded border of its own
 * color. The groups share the list's height and its columns (through subgrid), so every bar lines up.
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

  /** Each group's skills, with their place among all the skills (their turn to fill) */
  let index = 0;
  const groups = SKILL_GROUPS.map(({ id: groupId, skills }) => ({
    groupId,
    skills: Object.entries(skills).map(([name, percent]) => ({ name, percent, index: index++ })),
  }));
  const skillCount = index;

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
  }, [skillCount, reducedMotion]);

  return (
    <div
      ref={listRef}
      dir="ltr"
      className={classNames(styles.list, className)}
      style={
        {
          "--count": skillCount + groups.length,
          "--groups": groups.length,
          "--segments": SKILL_MAX_SEGMENTS,
        } as CSSProperties
      }
    >
      {groups.map(({ groupId, skills }, groupIndex) => (
        <div
          key={groupId}
          className={styles.group}
          data-group={groupId}
          style={{ "--rows": skills.length + 1, "--index": groupIndex } as CSSProperties}
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
