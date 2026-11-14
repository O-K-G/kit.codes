import { RefObject, useEffect } from "react";

/** Whether `el` can still scroll by (dx, dy): it's a scroll container, overflows, and isn't at that end */
function canScroll(el: Element, dx: number, dy: number) {
  const { overflowX, overflowY } = getComputedStyle(el);
  const scrollable = (overflow: string) => /auto|scroll|overlay/.test(overflow);

  if (dy !== 0 && scrollable(overflowY) && el.scrollHeight > el.clientHeight) {
    const room = dy < 0 ? el.scrollTop : el.scrollHeight - el.clientHeight - el.scrollTop;
    if (room > 1) return true;
  }

  // The page never scrolls sideways, so a sideways scroll can't reach it: any room will do
  return dx !== 0 && scrollable(overflowX) && el.scrollWidth > el.clientWidth;
}

/** Keys that scroll, and which way (down is positive) */
const SCROLL_KEYS: Record<string, number> = {
  ArrowDown: 1,
  PageDown: 1,
  End: 1,
  " ": 1,
  ArrowUp: -1,
  PageUp: -1,
  Home: -1,
};

/** Where keys edit text rather than scroll */
const FIELDS = "input, textarea, select, [contenteditable]";

/** Where Space presses rather than scrolls */
const CONTROLS = "button, a[href], summary, [role]";

/**
 * While `active`, the page behind the dialog doesn't scroll by mouse wheel, touch or keyboard, yet
 * keeps its scrollbar (hiding it would widen the page, shifting it sideways). A wheel, swipe or key goes
 * through only where something in the dialog, from the pointer (or focus) up to the dialog itself, can
 * still scroll that way; anything else is cancelled, so it can't carry on to the page (at a scrolling
 * area's end, say). Only the topmost open dialog does this, when dialogs are stacked. Typing in a
 * field, or pressing a button with Space, isn't affected.
 */
export default function usePreventPageScroll(
  dialogRef: RefObject<HTMLDialogElement | null>,
  active: boolean
) {
  useEffect(() => {
    const dialog = dialogRef.current;
    if (!active || !dialog) {
      return;
    }

    let touchX = 0;
    let touchY = 0;

    const isTopmost = () => Array.from(document.querySelectorAll("dialog[open]")).at(-1) === dialog;

    /** Cancels the scroll unless an element in the dialog, from `target` up, takes it */
    const block = (event: Event, dx: number, dy: number) => {
      if (!isTopmost() || !event.cancelable) {
        return;
      }

      for (let el = event.target as Element | null; el && dialog.contains(el); el = el.parentElement) {
        if (canScroll(el, dx, dy)) {
          return;
        }
      }

      event.preventDefault();
    };

    const handleKeyDown = (event: KeyboardEvent) => {
      const direction = SCROLL_KEYS[event.key];
      if (!direction || event.altKey || event.ctrlKey || event.metaKey) {
        return;
      }
      const target = event.target as Element;
      if (target.closest?.(FIELDS) || (event.key === " " && target.closest?.(CONTROLS))) {
        return;
      }

      block(event, 0, event.shiftKey && event.key === " " ? -1 : direction);
    };

    const handleWheel = (event: WheelEvent) => block(event, event.deltaX, event.deltaY);

    const handleTouchStart = ({ touches }: TouchEvent) => {
      touchX = touches[0].clientX;
      touchY = touches[0].clientY;
    };

    /** A finger moving up scrolls down: the scroll goes against the finger */
    const handleTouchMove = (event: TouchEvent) => {
      const { clientX, clientY } = event.touches[0];
      block(event, touchX - clientX, touchY - clientY);
      touchX = clientX;
      touchY = clientY;
    };

    // Not passive, so they can cancel the scroll
    const options = { passive: false, capture: true };
    document.addEventListener("keydown", handleKeyDown, options);
    document.addEventListener("wheel", handleWheel, options);
    document.addEventListener("touchstart", handleTouchStart, options);
    document.addEventListener("touchmove", handleTouchMove, options);

    return () => {
      document.removeEventListener("keydown", handleKeyDown, options);
      document.removeEventListener("wheel", handleWheel, options);
      document.removeEventListener("touchstart", handleTouchStart, options);
      document.removeEventListener("touchmove", handleTouchMove, options);
    };
  }, [dialogRef, active]);
}
