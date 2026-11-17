"use client";

import { useRef } from "react";
import { useTranslations } from "next-intl";
import { TimelineProps } from "@constants/interfaces";
import Tooltip from "@ui/tooltip/Tooltip";
import classNames from "@utils/classNames";
import useEasedScrollLight from "@hooks/useEasedScrollLight";
import styles from "./Timeline.module.css";

export const TIMELINE_BRANCH_TEST_ID = "timeline-branch-test-id";

/**
 * A vertical timeline: a center axis with branches alternating to either side (on narrow screens they
 * all go to one side). Each branch ends in a circle with its icon (a "+" without one), with its year and
 * title beside it; the circle glows on hover or focus and shows the branch's text in a tooltip.
 *
 * The axis runs from the first branch's line to the last one's, each branch drawing its part (see
 * Lines). As the page scrolls, it lights up down to the middle of the screen, and each branch's circle
 * and line light up as the light reaches them. The light eases after the scroll rather than jumping
 * with each step of a mouse wheel (see useEasedScrollLight); until that runs, or without it, CSS
 * scroll-driven animations light it (see Timeline.module.css).
 *
 * The circle can be focused (a named group, not a button), and its tooltip describes it (see Tooltip).
 */
export default function Timeline({ items, "aria-label": ariaLabel }: TimelineProps) {
  const t = useTranslations("timelineText");
  const listRef = useRef<HTMLOListElement>(null);
  useEasedScrollLight(listRef, {
    light: styles.light,
    glow: styles.glow,
    axisPart: styles.axisPart,
    node: styles.node,
  });

  return (
    <ol ref={listRef} aria-label={ariaLabel} className={styles.timeline}>
      {/* Keyed by place: titles can repeat (several are the same in Hebrew) */}
      {items.map(({ year, title, text, icon }, index) => (
        <li key={index} data-testid={TIMELINE_BRANCH_TEST_ID} className={styles.branch}>
          <Lines className={styles.unlit} />
          <Lines className={styles.glow} />
          <Lines className={styles.light} />

          <Tooltip
            // Just a circle, not a button: a group, named ("More about …") and described by its
            // tooltip. A plain span can't be named (ARIA prohibits it: some screen readers drop it)
            role="group"
            tabIndex={0}
            aria-label={t("infoLabel", { title })}
            content={text}
            placement="bottom"
            align="start"
            keepInViewport
            className={styles.node}
            tooltipClassName={styles.tooltip}
            boxClassName={styles.tooltipBox}
          >
            {/* Twice: dim, and over it lit and glowing, fading in as the circle lights */}
            <span className={styles.icon} aria-hidden>
              <span className={styles.iconUnlit}>{icon ?? "+"}</span>
              <span className={styles.iconLit}>{icon ?? "+"}</span>
            </span>
          </Tooltip>

          <div className={styles.label}>
            <span className={styles.year}>{year}</span>
            <h3 className={styles.title}>{title}</h3>
          </div>
        </li>
      ))}
    </ol>
  );
}

/** One layer of a branch's lines (unlit, the light's glow, or the light): its part of the axis, and its
 * line to its circle */
function Lines({ className }: { className: string }) {
  return (
    <span className={classNames(styles.lines, className)} aria-hidden>
      <span className={styles.axisPart} />
      <span className={styles.branchPart} />
    </span>
  );
}
