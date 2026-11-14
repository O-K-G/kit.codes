"use client";

import { ReactNode, useEffect, useRef } from "react";

/**
 * Pauses its children's animations while their section is off screen (they're only seen inside it): CSS
 * ones, through data-paused (see the CSS), and SVG ones (<animate>), through the SVG's own pause. So a
 * background's animated parts cost nothing once scrolled past.
 */
export default function PauseOffscreen({
  className,
  children,
}: {
  className?: string;
  children: ReactNode;
}) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const element = ref.current;
    const section = element?.closest("section");
    if (!element || !section) {
      return;
    }

    // 1px in from the screen's edges: a section that only touches the screen (the one just scrolled
    // past) doesn't count as on it
    const observer = new IntersectionObserver(
      ([{ isIntersecting }]) => {
        element.dataset.paused = String(!isIntersecting);
        element.querySelectorAll("svg").forEach((svg) =>
          isIntersecting ? svg.unpauseAnimations() : svg.pauseAnimations()
        );
      },
      { rootMargin: "-1px" }
    );
    observer.observe(section);

    return () => observer.disconnect();
  }, []);

  return (
    <div ref={ref} className={className}>
      {children}
    </div>
  );
}
