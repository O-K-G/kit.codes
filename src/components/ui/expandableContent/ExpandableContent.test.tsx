import { act, fireEvent, render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import ExpandableContent from "@ui/expandableContent/ExpandableContent";
import styles from "@ui/expandableContent/ExpandableContent.module.css";

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
  const gaugeFill = container.querySelector(`.${styles.gaugeFill}`) as HTMLElement;
  const content = screen.getByText(TEXT).parentElement as HTMLElement;
  return { container, gaugeFill, content };
}

describe("ExpandableContent", () => {
  it("is not interactive, and its text is in the document from the start (for screen readers)", () => {
    const { container, content } = renderContent();

    expect(screen.queryByRole("button")).not.toBeInTheDocument();
    expect(screen.getByText(TEXT)).toBeInTheDocument();
    expect(content).toHaveAttribute("data-open", "false");
    expect(content).not.toHaveAttribute("tabindex");
    expect(container.querySelector(`.${styles.gauge}`)).toHaveAttribute("aria-hidden", "true");
  });

  it("runs the gauge only while in view", () => {
    const { gaugeFill } = renderContent();
    expect(gaugeFill).toHaveAttribute("data-running", "false");

    setVisible(true);
    expect(gaugeFill).toHaveAttribute("data-running", "true");

    setVisible(false);
    expect(gaugeFill).toHaveAttribute("data-running", "false");
  });

  it("expands once the gauge is full, and stops observing", () => {
    const { gaugeFill, content } = renderContent();
    setVisible(true);

    fireEvent.animationEnd(gaugeFill);

    expect(content).toHaveAttribute("data-open", "true");
    expect(content).toHaveAttribute("tabindex", "0");
    expect(disconnect).toHaveBeenCalled();
  });
});
