"use client";

import { ReactNode, useRef } from "react";
import useSectionOnScreen from "@hooks/useSectionOnScreen";

/**
 * Half a screen's margin above and below: a background counts as on screen a little before its section
 * scrolls in, so it's drawn by the time it shows, even on a fast fling
 */
const NEAR_SCREEN_MARGIN = "50% 0px";

/**
 * SectionBackground's box, marked data-offscreen while its section is well off screen (see
 * SectionBackground.module.css). Every section's background is fixed, a screen big, and zooms as the
 * page scrolls: without this, all of them would be composited at every frame of the scroll, though
 * one or two are seen. Shown until it's known to be off screen.
 */
export default function BackgroundContainer({
  className,
  children,
}: {
  className?: string;
  children: ReactNode;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const onScreen = useSectionOnScreen(ref, NEAR_SCREEN_MARGIN);

  return (
    <div ref={ref} className={className} data-offscreen={onScreen === false || undefined}>
      {children}
    </div>
  );
}
