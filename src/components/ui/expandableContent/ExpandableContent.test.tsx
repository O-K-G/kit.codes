import { act, createEvent, fireEvent, render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import ExpandableContent from "@ui/expandableContent/ExpandableContent";
import gaugeStyles from "@ui/expandableContent/gauge/Gauge.module.css";

/** Runs the gauge for `ms` (its timing follows requestAnimationFrame, faked here): it hits 100% at 0.8s
 * and is done at 1.6s */
const advance = (ms: number) => act(() => jest.advanceTimersByTime(ms));

/** Fires animationend for the named animation (jsdom has no AnimationEvent to carry its name) */
function fireNamedAnimationEnd(element: HTMLElement, animationName: string) {
  const event = createEvent.animationEnd(element);
  Object.defineProperty(event, "animationName", { value: animationName });
  fireEvent(element, event);
}

const TEXT = "Results-driven web developer";

/** jsdom has no IntersectionObserver: a mock whose visibility the test drives. */
let setVisible: (visible: boolean) => void = () => undefined;
const disconnect = jest.fn();

afterEach(() => jest.useRealTimers());

beforeEach(() => {
  jest.useFakeTimers();
  disconnect.mockClear();
  window.IntersectionObserver = jest.fn(
    (callback: IntersectionObserverCallback) => {
      setVisible = (visible) =>
        act(() =>
          callback(
            [{ isIntersecting: visible } as IntersectionObserverEntry],
            {} as IntersectionObserver
          )
        );
      return { observe: jest.fn(), disconnect } as unknown as IntersectionObserver;
    }
  ) as unknown as typeof IntersectionObserver;
});

function renderContent() {
  const { container } = render(<ExpandableContent text={TEXT} />);
  const gauge = container.querySelector(`.${gaugeStyles.gauge}`) as HTMLElement;
  const content = screen.getByText(TEXT).parentElement as HTMLElement;
  return { container, gauge, content };
}

describe("ExpandableContent", () => {
  it("is not interactive, and its text is in the document from the start (for screen readers)", () => {
    const { container, content } = renderContent();

    expect(screen.queryByRole("button")).not.toBeInTheDocument();
    expect(screen.getByText(TEXT)).toBeInTheDocument();
    expect(content).toHaveAttribute("data-open", "false");
    expect(content).not.toHaveAttribute("tabindex");
    expect(container.querySelector(`.${gaugeStyles.gauge}`)).toHaveAttribute("aria-hidden", "true");
  });

  it("runs the gauge only while in view", () => {
    const { gauge } = renderContent();
    expect(gauge).toHaveAttribute("data-running", "false");

    setVisible(true);
    expect(gauge).toHaveAttribute("data-running", "true");

    setVisible(false);
    expect(gauge).toHaveAttribute("data-running", "false");
  });

  it("blinks the corner brackets once the count hits 100%", () => {
    const { container } = renderContent();
    setVisible(true);
    const brackets = container.querySelectorAll(`[data-blink]`);

    expect(brackets.length).toBeGreaterThan(0);
    brackets.forEach((element) => expect(element).toHaveAttribute("data-blink", "false"));

    advance(900);
    brackets.forEach((element) => expect(element).toHaveAttribute("data-blink", "true"));
  });

  it("expands once the count has blinked, and stops observing", () => {
    const { gauge, content } = renderContent();
    // A text longer than the box: it scrolls, so the box can be focused once open
    Object.defineProperty(content, "scrollHeight", { configurable: true, value: 500 });
    Object.defineProperty(content, "clientHeight", { configurable: true, value: 200 });
    setVisible(true);

    // Full, still blinking
    advance(1200);
    expect(content).toHaveAttribute("data-open", "false");

    // Done blinking
    advance(500);

    expect(content).toHaveAttribute("data-open", "true");
    expect(content).toHaveAttribute("tabindex", "0");
    expect(disconnect).toHaveBeenCalled();
    // Done: the gauge stops
    expect(gauge).toHaveAttribute("data-running", "false");
  });

  it("isn't a stop for the keyboard when its content fits", () => {
    const { content } = renderContent();
    Object.defineProperty(content, "scrollHeight", { configurable: true, value: 200 });
    Object.defineProperty(content, "clientHeight", { configurable: true, value: 200 });
    setVisible(true);
    advance(1700);

    expect(content).toHaveAttribute("data-open", "true");
    expect(content).not.toHaveAttribute("tabindex");
  });

  it("shows children in place of the text, and tells once it's done opening", () => {
    const onOpened = jest.fn();
    render(
      <ExpandableContent onOpened={onOpened}>
        <span>Typed quotes</span>
      </ExpandableContent>
    );
    const content = screen.getByText("Typed quotes").parentElement as HTMLElement;
    setVisible(true);
    advance(1700);
    expect(content).toHaveAttribute("data-open", "true");

    // Only the frame's drawing ends the opening, not the box's other animations or its children's
    fireNamedAnimationEnd(content, "Module__reveal-while-expanding");
    fireNamedAnimationEnd(screen.getByText("Typed quotes"), "Module__expand-button");
    expect(onOpened).not.toHaveBeenCalled();

    fireNamedAnimationEnd(content, "Module__expand-button");
    expect(onOpened).toHaveBeenCalledTimes(1);
  });
});
