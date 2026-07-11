import { useEffect } from "react";

type UseFadeInProps = {
  id: string;
};

export function useFadeIn({ id }: UseFadeInProps) {
  useEffect(() => {
    const sectionEl = document.getElementById(id);
    const handleObserve = (entries: IntersectionObserverEntry[]): void => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const el = entry.target as HTMLElement;
          if (el?.dataset.visible === "false") {
            el.dataset.visible = "true";
          }
        }
      });
    };

    const observer = new IntersectionObserver(handleObserve, {
      root: null,
      threshold: 0.1,
    });

    if (sectionEl) {
      observer.observe(sectionEl);
    }

    return () => {
      if (sectionEl) {
        observer.disconnect();
      }
    };
  }, [id]);
}
