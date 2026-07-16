import { useEffect } from "react";

/**
 * This hook tracks on scroll which section is in view, and highlights/turns off the <Nav /> links.
 * The last two sections are relatively small in height, so they required their own exceptions
 * to be detected and flagged as 'in view' properly.
 */

export function useHighlightNavLinks() {
  useEffect(() => {
    const mainEl = document.getElementsByTagName("main")[0];
    if (!mainEl) {
      return;
    }

    let ticking = false;

    const updateActiveSection = () => {
      const sections = Array.from(document.getElementsByTagName("section"));
      const navElements = Array.from(
        document.querySelectorAll("[data-selection-id]"),
      ) as HTMLElement[];

      if (sections.length === 0 || navElements.length === 0) {
        return;
      }

      const remainingScroll =
        mainEl.scrollHeight - mainEl.clientHeight - mainEl.scrollTop;
      const isAtBottom = Math.abs(remainingScroll) <= 1;
      const isAlmostAtBottom = remainingScroll <= 150;

      let activeSectionId = "";

      if (isAtBottom) {
        activeSectionId = sections[sections.length - 1]?.id;
      } else if (isAlmostAtBottom) {
        activeSectionId = sections[sections.length - 2]?.id;
      } else {
        const arr = sections.map(
          (section) => section.offsetTop - mainEl.scrollTop,
        );
        const positiveNumbers = arr.filter((num) => num > 0);

        if (positiveNumbers.length > 0) {
          const minPositiveVal = Math.min(...positiveNumbers);
          const minIndex = arr.indexOf(minPositiveVal);
          activeSectionId = sections[minIndex]?.id;
        } else {
          activeSectionId = sections[sections.length - 1]?.id;
        }
      }

      navElements.forEach((el) => {
        const isActive = el.dataset.selectionId === activeSectionId;
        el.dataset.isInView = isActive ? "true" : "false";

        const link = el.querySelector("a");
        if (isActive) {
          link?.setAttribute("aria-current", "true");
        } else {
          link?.removeAttribute("aria-current");
        }
      });
    };

    const handleScroll = () => {
      if (ticking) {
        return;
      }
      ticking = true;
      requestAnimationFrame(() => {
        updateActiveSection();
        ticking = false;
      });
    };

    updateActiveSection();
    mainEl.addEventListener("scroll", handleScroll);

    return () => mainEl.removeEventListener("scroll", handleScroll);
  }, []);
}
