"use client";

import { useTranslations } from "next-intl";
import { TimelineProps } from "@constants/interfaces";
import Tooltip from "@ui/tooltip/Tooltip";
import styles from "./Timeline.module.css";

export const TIMELINE_BRANCH_TEST_ID = "timeline-branch-test-id";

/**
 * A vertical timeline: a center axis with branches alternating to either side (on narrow screens they
 * all go to one side). Each branch ends in a "+" circle, with its year and title beside it; the circle
 * glows on hover or focus and shows the branch's text in a tooltip.
 *
 * The axis runs from the first branch's circle to the last one's, each branch drawing its part. As the
 * page scrolls, it lights up down to the middle of the screen, and each branch's circle lights up as
 * the light reaches it: all in CSS (scroll-driven animations, see Timeline.module.css).
 *
 * The circle can be focused, and its tooltip describes it (see Tooltip).
 */
export default function Timeline({ items, "aria-label": ariaLabel }: TimelineProps) {
  const t = useTranslations("timelineText");

  return (
    <ol aria-label={ariaLabel} className={styles.timeline}>
      {items.map(({ year, title, text }) => (
        <li key={title} data-testid={TIMELINE_BRANCH_TEST_ID} className={styles.branch}>
          <span className={styles.axis} aria-hidden />

          <Tooltip
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
            <span className={styles.plus} aria-hidden>
              +
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
