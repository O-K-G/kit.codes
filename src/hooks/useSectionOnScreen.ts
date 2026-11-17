import { RefObject, useEffect, useState } from "react";

/**
 * Whether the section holding `ref`'s element is on screen, kept up to date as the page scrolls: null
 * until it's known (just after mounting). By default a section that only touches the screen's edge (the
 * one just scrolled past) doesn't count as on it; a `rootMargin` widens (or narrows) the screen it's
 * checked against, e.g. to count a section as on screen a little before it scrolls in.
 */
export default function useSectionOnScreen(
  ref: RefObject<HTMLElement | null>,
  // 1px in from the screen's edges, so touching it isn't enough
  rootMargin = "-1px",
) {
  const [onScreen, setOnScreen] = useState<boolean | null>(null);

  useEffect(() => {
    const section = ref.current?.closest("section");
    if (!section) {
      return;
    }

    const observer = new IntersectionObserver(([{ isIntersecting }]) => setOnScreen(isIntersecting), {
      rootMargin,
    });
    observer.observe(section);

    return () => observer.disconnect();
  }, [ref, rootMargin]);

  return onScreen;
}
