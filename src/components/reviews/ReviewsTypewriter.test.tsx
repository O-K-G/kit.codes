import { act, render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import ReviewsTypewriter from "@components/reviews/ReviewsTypewriter";
import styles from "@components/reviews/ReviewsTypewriter.module.css";

const QUOTES = ["Sharp.", "Great team player."];

/** The expandable box (tested on its own): here, a button stands for its opening ending. (By a relative
 * path: the path aliases are compiled into the imports, not jest.mock's) */
jest.mock("../ui/expandableContent/ExpandableContent", () => ({
  __esModule: true,
  default: ({ children, onOpened }: { children: React.ReactNode; onOpened?: () => void }) => (
    <div>
      <button type="button" onClick={onOpened}>
        opened
      </button>
      {children}
    </div>
  ),
}));

const finishOpening = () => act(() => screen.getByRole("button", { name: "opened" }).click());

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
    QUOTES.forEach((quote) => expect(screen.getByText(quote, { selector: ".sr-only" })).toBeInTheDocument());
  });

  it("types once its box is done opening, only while in view, then the next quote after a pause", () => {
    const { container } = render(<ReviewsTypewriter quotes={QUOTES} label="Reviews" />);
    setVisible(true);
    advance(5000);
    expect(typedTexts(container)).toEqual(["", ""]);

    setVisible(false);
    finishOpening();
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

  it("clears the quotes 4s after the last is typed, then starts over 2s after they're gone", () => {
    const { container } = render(<ReviewsTypewriter quotes={QUOTES} label="Reviews" />);
    finishOpening();
    setVisible(true);
    const list = screen.getByRole("list");
    // Every letter of both quotes, and the pause between them (a step at a time: each timer is set as
    // the previous one's update renders)
    for (let letter = 0; letter < QUOTES[0].length; letter++) {
      advance(60);
    }
    advance(2000);
    for (let letter = 0; letter < QUOTES[1].length; letter++) {
      advance(60);
    }
    expect(typedTexts(container)).toEqual(QUOTES);

    advance(3900);
    expect(list).not.toHaveAttribute("data-cleared");
    advance(100);
    expect(list).toHaveAttribute("data-cleared");
    expect(typedTexts(container)).toEqual(QUOTES);

    // Gone (faded out), then empty for 2s
    advance(2200);
    expect(list).toHaveAttribute("data-cleared");
    advance(100);
    expect(list).not.toHaveAttribute("data-cleared");
    expect(typedTexts(container)).toEqual(["", ""]);
    expect(container.querySelectorAll("li")[0]).toHaveAttribute("data-state", "typing");

    advance(60);
    expect(typedTexts(container)[0]).toBe(QUOTES[0].slice(0, 1));
  });

  it("counts the time since the box opened, from TTI 00:00", () => {
    const { container } = render(<ReviewsTypewriter quotes={QUOTES} label="Reviews" />);
    const timestamp = () => container.querySelector(`.${styles.timestamp}`);
    advance(5000);
    expect(timestamp()).toHaveTextContent("TTI 00:00");
    // Hidden, with the illustration under the quotes, until the box is done opening
    expect(timestamp()?.parentElement).toHaveAttribute("data-hidden");

    finishOpening();
    expect(timestamp()?.parentElement).not.toHaveAttribute("data-hidden");
    advance(999);
    expect(timestamp()).toHaveTextContent("TTI 00:00");
    advance(1);
    expect(timestamp()).toHaveTextContent("TTI 00:01");
    advance(64000);
    expect(timestamp()).toHaveTextContent("TTI 01:05");

    // After 99:59, it starts over from 00:00
    advance((99 * 60 + 59 - 65) * 1000);
    expect(timestamp()).toHaveTextContent("TTI 99:59");
    advance(1000);
    expect(timestamp()).toHaveTextContent("TTI 00:00");
    advance(1000);
    expect(timestamp()).toHaveTextContent("TTI 00:01");
  });

  it("shows the source under the quotes, between `below` and the timestamp", () => {
    const { container } = render(
      <ReviewsTypewriter
        quotes={QUOTES}
        label="Reviews"
        below={<span>dish</span>}
        source={<a href="https://example.com">Source</a>}
      />
    );
    const bottom = container.querySelector(`.${styles.timestamp}`)?.parentElement as HTMLElement;

    expect(Array.from(bottom.children, (child) => child.textContent)).toEqual(["dish", "Source", "TTI 00:00"]);
    expect(screen.getByRole("link", { name: "Source" })).toHaveAttribute("href", "https://example.com");
  });

  it("pauses the typing and the timer with its button, and plays them again (WCAG 2.2.2)", () => {
    const { container } = render(<ReviewsTypewriter quotes={QUOTES} label="Reviews" />);
    const timestamp = () => container.querySelector(`.${styles.timestamp}`);
    finishOpening();
    setVisible(true);
    advance(60);
    advance(60);
    expect(typedTexts(container)[0]).toBe(QUOTES[0].slice(0, 2));

    act(() => screen.getByRole("button", { name: "PAUSE" }).click());
    expect(container.querySelector(`.${styles.layout}`)).toHaveAttribute("data-paused");
    advance(5000);
    expect(typedTexts(container)[0]).toBe(QUOTES[0].slice(0, 2));
    expect(timestamp()).toHaveTextContent("TTI 00:00");

    act(() => screen.getByRole("button", { name: "PLAY" }).click());
    expect(container.querySelector(`.${styles.layout}`)).not.toHaveAttribute("data-paused");
    advance(60);
    expect(typedTexts(container)[0]).toBe(QUOTES[0].slice(0, 3));
    // The timer shows the time since the box opened again
    advance(1000);
    expect(timestamp()).toHaveTextContent("TTI 00:06");
  });

  it("shows all the quotes at once with reduced motion", () => {
    mockReducedMotion(true);
    const { container } = render(<ReviewsTypewriter quotes={QUOTES} label="Reviews" />);

    expect(typedTexts(container)).toEqual(QUOTES);
    expect(container.querySelector(`.${styles.cursor}`)).not.toBeInTheDocument();
  });
});
