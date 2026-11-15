import { act, render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import ReviewsTypewriter from "@components/reviews/ReviewsTypewriter";
import styles from "@components/reviews/ReviewsTypewriter.module.css";

const QUOTES = ["Sharp.", "Great team player."];

/** jsdom has no IntersectionObserver: a mock whose visibility the test drives */
let setVisible: (visible: boolean) => void = () => undefined;

function mockReducedMotion(reduce: boolean) {
  window.matchMedia = jest.fn((query: string) => ({
    matches: reduce && query.includes("reduce"),
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
  })) as unknown as typeof window.matchMedia;
}

beforeEach(() => {
  jest.useFakeTimers();
  mockReducedMotion(false);
  window.IntersectionObserver = jest.fn((callback: IntersectionObserverCallback) => {
    setVisible = (visible) =>
      act(() => callback([{ isIntersecting: visible } as IntersectionObserverEntry], {} as IntersectionObserver));
    return { observe: jest.fn(), disconnect: jest.fn() } as unknown as IntersectionObserver;
  }) as unknown as typeof IntersectionObserver;
});

afterEach(() => {
  jest.useRealTimers();
});

/** The visible (typed) text of each quote, without the part yet to be typed */
const typedTexts = (container: HTMLElement) =>
  Array.from(container.querySelectorAll(`.${styles.text}`), (text) =>
    Array.from(text.childNodes)
      .filter((node) => node.nodeType === Node.TEXT_NODE)
      .map((node) => node.textContent)
      .join("")
  );

const advance = (ms: number) => act(() => jest.advanceTimersByTime(ms));

describe("ReviewsTypewriter", () => {
  it("gives screen readers every quote whole, in a labeled list", () => {
    render(<ReviewsTypewriter quotes={QUOTES} label="Reviews" />);

    expect(screen.getByRole("list", { name: "Reviews" })).toBeInTheDocument();
    QUOTES.forEach((quote) => expect(screen.getByText(quote, { selector: `.${styles.srOnly}` })).toBeInTheDocument());
  });

  it("types only while in view, then the next quote after a pause", () => {
    const { container } = render(<ReviewsTypewriter quotes={QUOTES} label="Reviews" />);
    advance(5000);
    expect(typedTexts(container)).toEqual(["", ""]);

    setVisible(true);
    for (let letter = 0; letter < QUOTES[0].length; letter++) {
      advance(60);
    }
    expect(typedTexts(container)).toEqual([QUOTES[0], ""]);

    // The pause: nothing more for a while
    advance(1900);
    expect(typedTexts(container)).toEqual([QUOTES[0], ""]);

    advance(200);
    advance(60);
    expect(typedTexts(container)[1]).toBe(QUOTES[1].slice(0, 1));
    expect(container.querySelectorAll("li")[0]).toHaveAttribute("data-state", "typed");
    expect(container.querySelectorAll("li")[1]).toHaveAttribute("data-state", "typing");
  });

  it("shows all the quotes at once with reduced motion", () => {
    mockReducedMotion(true);
    const { container } = render(<ReviewsTypewriter quotes={QUOTES} label="Reviews" />);

    expect(typedTexts(container)).toEqual(QUOTES);
    expect(container.querySelector(`.${styles.cursor}`)).not.toBeInTheDocument();
  });
});
