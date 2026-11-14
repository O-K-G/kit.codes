import { act, fireEvent, render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import ExpandableContent from "@ui/expandableContent/ExpandableContent";
import gaugeStyles from "@ui/expandableContent/gauge/Gauge.module.css";

const TEXT = "Results-driven web developer";

/** jsdom has no IntersectionObserver: a mock whose visibility the test drives. */
let setVisible: (visible: boolean) => void = () => undefined;
const disconnect = jest.fn();

beforeEach(() => {
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
  const gaugeFill = container.querySelector(`.${gaugeStyles.gauge} > .${gaugeStyles.ring} > .${gaugeStyles.fill}`) as HTMLElement;
  const gaugeCountText = container.querySelector(`.${gaugeStyles.countText}`) as HTMLElement;
  const content = screen.getByText(TEXT).parentElement as HTMLElement;
  return { container, gaugeFill, gaugeCountText, content };
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
    const { gaugeFill } = renderContent();
    expect(gaugeFill).toHaveAttribute("data-running", "false");

    setVisible(true);
    expect(gaugeFill).toHaveAttribute("data-running", "true");

    setVisible(false);
    expect(gaugeFill).toHaveAttribute("data-running", "false");
  });

  it("blinks the corner brackets once the count hits 100%", () => {
    const { container } = renderContent();
    setVisible(true);
    const brackets = container.querySelectorAll(`[data-blink]`);

    expect(brackets.length).toBeGreaterThan(0);
    brackets.forEach((element) => expect(element).toHaveAttribute("data-blink", "false"));

    fireEvent.animationEnd(container.querySelector(`.${gaugeStyles.count}`) as HTMLElement);
    brackets.forEach((element) => expect(element).toHaveAttribute("data-blink", "true"));
  });

  it("expands once the count has blinked, and stops observing", () => {
    const { gaugeFill, gaugeCountText, content } = renderContent();
    setVisible(true);

    fireEvent.animationEnd(gaugeFill);
    expect(content).toHaveAttribute("data-open", "false");

    fireEvent.animationEnd(gaugeCountText);

    expect(content).toHaveAttribute("data-open", "true");
    expect(content).toHaveAttribute("tabindex", "0");
    expect(disconnect).toHaveBeenCalled();
  });
});
