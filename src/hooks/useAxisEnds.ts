import { RefObject, useEffect } from "react";

/**
 * Where the axis' light starts and ends in the list (see Timeline.module.css): --axis-head, from the
 * list's top to the first part's top, and --axis-tail, from the last part's bottom to the list's bottom,
 * in px. The CSS-lit tip fades in and out there. Measured once, and again as the list's size changes,
 * never while scrolling.
 */
export default function useAxisEnds(listRef: RefObject<HTMLElement | null>, light: string, axisPart: string) {
  useEffect(() => {
    const list = listRef.current;
    if (!list) {
      return;
    }

    const measure = () => {
      const parts = list.querySelectorAll(`.${light} .${axisPart}`);
      if (!parts.length) {
        return;
      }
      const listBox = list.getBoundingClientRect();
      const head = parts[0].getBoundingClientRect().top - listBox.top;
      const tail = listBox.bottom - parts[parts.length - 1].getBoundingClientRect().bottom;
      list.style.setProperty("--axis-head", `${head.toFixed(2)}px`);
      list.style.setProperty("--axis-tail", `${tail.toFixed(2)}px`);
    };

    measure();
    const resizeObserver = typeof ResizeObserver === "undefined" ? null : new ResizeObserver(measure);
    resizeObserver?.observe(list);

    return () => {
      resizeObserver?.disconnect();
      ["--axis-head", "--axis-tail"].forEach((name) => list.style.removeProperty(name));
    };
  }, [listRef, light, axisPart]);
}
