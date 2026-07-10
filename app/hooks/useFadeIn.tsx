import { RefObject, useEffect } from "react";

type UseFadeInProps = {
  ref: RefObject<HTMLElement | null>;
};

export function useFadeIn({ ref }: UseFadeInProps) {
  useEffect(() => {
    const { current } = ref || {};
    const handleObserve = (
      entries: IntersectionObserverEntry[],
      observer: IntersectionObserver,
    ): void => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          if (current?.dataset.visible === "false") {
            current.dataset.visible = "true";
            observer.disconnect();
          }
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
