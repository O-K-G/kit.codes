import { useEffect } from "react";

/**
 * This hook uses an IntersectionObserver (scoped to <main>) to track which section is in view,
 * and highlights/turns off the <Nav /> links accordingly. The active section is whichever one
 * has the highest intersection ratio - since that ratio is normalized to each section's own
 * height, a short section that's fully visible outranks a tall one that's only partly visible,
 * so short trailing sections don't need any special-casing.
 */

export function useHighlightNavLinks() {
  useEffect(() => {
    const mainEl = document.getElementsByTagName("main")[0];
    const sections = Array.from(document.getElementsByTagName("section"));
    const navElements = Array.from(
      document.querySelectorAll("[data-selection-id]"),
    ) as HTMLElement[];

    if (!mainEl || sections.length === 0 || navElements.length === 0) {
      return;
    }

    const ratiosBySectionId = new Map<string, number>();

    const setActiveSection = (activeSectionId: string) => {
      navElements.forEach((el) => {
        const isActive = el.dataset.selectionId === activeSectionId;
        el.dataset.isInView = isActive ? "true" : "false";

        const link = el.querySelector("a");
        if (isActive) {
          return link?.setAttribute("aria-current", "true");
        }
        link?.removeAttribute("aria-current");
      });
    };

    const handleObserve = (entries: IntersectionObserverEntry[]) => {
      entries.forEach((entry) => {
        ratiosBySectionId.set(
          entry.target.id,
          entry.isIntersecting ? entry.intersectionRatio : 0,
        );
      });

      let activeSectionId = "";
      let maxRatio = 0;

      sections.forEach((section) => {
        const ratio = ratiosBySectionId.get(section.id) ?? 0;
        if (ratio > maxRatio) {
          maxRatio = ratio;
          activeSectionId = section.id;
        }
      });

      if (activeSectionId) {
        setActiveSection(activeSectionId);
      }
    };

    const observer = new IntersectionObserver(handleObserve, {
      root: mainEl,
      threshold: [0, 0.25, 0.5, 0.75, 1],
    });

    sections.forEach((section) => observer.observe(section));

    return () => observer.disconnect();
  }, []);
}
