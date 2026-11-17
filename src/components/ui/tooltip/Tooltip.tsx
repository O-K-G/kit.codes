"use client";

import { useEffect, useId, useRef, useState } from "react";
import { TooltipProps } from "@constants/interfaces";
import styles from "./Tooltip.module.css";
import classNames from "@utils/classNames";

/**
 * An element (its children, or nothing: it can be drawn by its class alone) with a tooltip, which the
 * element is described by (aria-describedby).
 *
 * The tooltip shows while the element is hovered or holds the focus, or, given `open`, while `open` is
 * true. It's placed above or below the element, aligned with its start, center or end; pages size and
 * style it with `tooltipClassName` (its place) and `boxClassName` (its box), and --tooltip-gap (the
 * space between them). Page styles always win over the tooltip's own (a cascade layer, see the CSS).
 * Given `keepInViewport`, it stays in the viewport: on the element's side with the most room, its
 * text scrolling (with a fade at the bottom while there's more) when it doesn't fit.
 *
 * Accessibility (WCAG 1.4.13): the tooltip is part of the element, so it can be hovered without
 * closing, and Escape closes a shown tooltip until the pointer or the focus leaves (or, given `open`,
 * until it closes).
 */
export default function Tooltip({
  content,
  children,
  open,
  placement = "top",
  align = "center",
  keepInViewport,
  className,
  tooltipClassName,
  boxClassName,
  ...props
}: TooltipProps) {
  const id = useId();
  const triggerRef = useRef<HTMLSpanElement>(null);
  /** Closed with Escape */
  const [dismissed, setDismissed] = useState(false);
  const [wasOpen, setWasOpen] = useState(open);

  // Once closed (given `open`), the next opening shows it again
  if (open !== wasOpen) {
    setWasOpen(open);
    if (!open) {
      setDismissed(false);
    }
  }

  useEffect(() => {
    const handleKeyDown = ({ key }: KeyboardEvent) => {
      const trigger = triggerRef.current;
      if (key === "Escape" && trigger && (open ?? trigger.matches(":hover, :focus-within"))) {
        setDismissed(true);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [open]);

  const reset = () => setDismissed(false);

  return (
    <span
      {...props}
      ref={triggerRef}
      aria-describedby={id}
      data-open={open}
      data-dismissed={dismissed || undefined}
      data-keep-in-viewport={keepInViewport || undefined}
      className={classNames(styles.trigger, className)}
      onPointerLeave={reset}
      onBlur={reset}
    >
      {children}
      <span
        id={id}
        role="tooltip"
        data-placement={placement}
        data-align={align}
        className={classNames(styles.tooltip, tooltipClassName)}
      >
        <span className={classNames(styles.box, boxClassName)}>{content}</span>
      </span>
    </span>
  );
}
