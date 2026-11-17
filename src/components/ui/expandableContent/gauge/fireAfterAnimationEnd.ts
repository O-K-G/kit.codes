import { createEvent, fireEvent } from "@testing-library/react";

/**
 * For tests: fires animationend on `element` for its ::after. jsdom has no AnimationEvent to carry
 * `pseudoElement`, so it's set on the event by hand. (The gauge's count text is the count's ::after,
 * whose animations end on the count.)
 */
export function fireAfterAnimationEnd(element: HTMLElement) {
  const event = createEvent.animationEnd(element);
  Object.defineProperty(event, "pseudoElement", { value: "::after" });
  fireEvent(element, event);
}
