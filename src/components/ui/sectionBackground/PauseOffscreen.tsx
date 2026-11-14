"use client";

import { CSSProperties, ReactNode, useEffect, useRef } from "react";
import useSectionOnScreen from "@hooks/useSectionOnScreen";

/**
 * Pauses its children's animations while their section is off screen (they're only seen inside it): CSS
 * ones, through data-paused (see the CSS), and SVG ones (<animate>), through the SVG's own pause. So a
 * background's animated parts cost nothing once scrolled past.
 */
export default function PauseOffscreen({
  className,
  style,
  children,
}: {
  className?: string;
  style?: CSSProperties;
  children: ReactNode;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const onScreen = useSectionOnScreen(ref, true);

  useEffect(() => {
    ref.current
      ?.querySelectorAll("svg")
      .forEach((svg) => (onScreen ? svg.unpauseAnimations() : svg.pauseAnimations()));
  }, [onScreen]);

  return (
    <div ref={ref} className={className} style={style} data-paused={!onScreen}>
      {children}
    </div>
  );
}
