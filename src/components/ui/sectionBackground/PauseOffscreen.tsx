"use client";

import { CSSProperties, ReactNode, createContext, useEffect, useRef } from "react";
import useSectionOnScreen from "@hooks/useSectionOnScreen";

/**
 * Whether the section is on screen (null until it's known), for the children that depend on it too (see
 * SkyStars): they share this one observer rather than each watching the section
 */
export const SectionOnScreenContext = createContext<boolean | null>(null);

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
  const onScreen = useSectionOnScreen(ref);
  /** Running until it's known to be off screen */
  const paused = onScreen === false;

  useEffect(() => {
    ref.current
      ?.querySelectorAll("svg")
      .forEach((svg) => (paused ? svg.pauseAnimations() : svg.unpauseAnimations()));
  }, [paused]);

  return (
    <div ref={ref} className={className} style={style} data-paused={paused}>
      <SectionOnScreenContext.Provider value={onScreen}>{children}</SectionOnScreenContext.Provider>
    </div>
  );
}
