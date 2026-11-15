import { RefObject, useEffect, useState } from "react";

/**
 * Whether the section holding `ref`'s element is on screen, kept up to date as the page scrolls: null
 * until it's known (just after mounting). A section that only touches the screen's edge (the one just
 * scrolled past) doesn't count as on it.
 */
export default function useSectionOnScreen(ref: RefObject<HTMLElement | null>) {
  const [onScreen, setOnScreen] = useState<boolean | null>(null);

  useEffect(() => {
    const section = ref.current?.closest("section");
    if (!section) {
      return;
    }

    // 1px in from the screen's edges, so touching it isn't enough
    const observer = new IntersectionObserver(([{ isIntersecting }]) => setOnScreen(isIntersecting), {
      rootMargin: "-1px",
    });
    observer.observe(section);

    return () => observer.disconnect();
  }, [ref]);

  return onScreen;
}
