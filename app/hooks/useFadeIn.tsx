import { RefObject, useEffect } from "react";

type UseFadeInProps = {
  ref: RefObject<HTMLElement | null>;
};

export function useFadeIn({ ref }: UseFadeInProps) {
  useEffect(() => {
    const { current } = ref || {};
    const handleObserve = (
      entries: IntersectionObserverEntry[],
    ): void => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const el = entry.target as HTMLElement;
          if (el?.dataset.visible === "false") {
            el.dataset.visible = "true";
          }

          document.querySelectorAll("[data-selection-id]").forEach((liEl) => {
            const navLiEl = liEl as HTMLLIElement;
            const isIdMatchSectionId = navLiEl.dataset.selectionId === el.id;

            if (isIdMatchSectionId) {
              return (navLiEl.dataset.isInView = "true");
            }

            navLiEl.dataset.isInView = "false";
          });
        }
      });
    };

    const observer = new IntersectionObserver(handleObserve, {
      root: null,
      threshold: 0.1,
    });

    if (current) {
      observer.observe(current);
    }

    return () => {
      if (current) {
        observer.disconnect();
      }
    };
  }, [ref]);
}
