import { act, render } from "@testing-library/react";
import "@testing-library/jest-dom";
import Gauge from "@ui/expandableContent/gauge/Gauge";
import styles from "@ui/expandableContent/gauge/Gauge.module.css";

/** Runs the gauge's frames for `ms` (its timing follows requestAnimationFrame, faked here) */
const advance = (ms: number) => act(() => jest.advanceTimersByTime(ms));

beforeEach(() => jest.useFakeTimers());
afterEach(() => jest.useRealTimers());

describe("Gauge", () => {
  it("is hidden from screen readers, and takes a className", () => {
    const { container } = render(<Gauge running={false} className="placed" />);

    expect(container.firstElementChild).toHaveAttribute("aria-hidden", "true");
    expect(container.firstElementChild).toHaveClass(styles.gauge, "placed");
  });

  it("reports the count hitting 100% at 0.8s, and completes once it has blinked twice (1.6s)", () => {
    const onFull = jest.fn();
    const onComplete = jest.fn();
    render(<Gauge running onFull={onFull} onComplete={onComplete} />);

    advance(700);
    expect(onFull).not.toHaveBeenCalled();
    advance(200);
    expect(onFull).toHaveBeenCalledTimes(1);
    expect(onComplete).not.toHaveBeenCalled();

    advance(800);
    expect(onComplete).toHaveBeenCalledTimes(1);
    advance(1000);
    expect(onFull).toHaveBeenCalledTimes(1);
    expect(onComplete).toHaveBeenCalledTimes(1);
  });

  it("holds still while not running, and goes on from where it was", () => {
    const onComplete = jest.fn();
    const { container, rerender } = render(<Gauge running onComplete={onComplete} />);
    expect(container.firstElementChild).toHaveAttribute("data-running", "true");

    advance(1000);
    rerender(<Gauge running={false} onComplete={onComplete} />);
    expect(container.firstElementChild).toHaveAttribute("data-running", "false");
    advance(5000);
    expect(onComplete).not.toHaveBeenCalled();

    rerender(<Gauge running onComplete={onComplete} />);
    advance(700);
    expect(onComplete).toHaveBeenCalledTimes(1);
  });

  it("with reduced motion, completes as soon as it runs", () => {
    window.matchMedia = jest.fn((query: string) => ({
      matches: query === "(prefers-reduced-motion: reduce)",
      addEventListener: jest.fn(),
      removeEventListener: jest.fn(),
    })) as unknown as typeof window.matchMedia;
    const onFull = jest.fn();
    const onComplete = jest.fn();
    render(<Gauge running onFull={onFull} onComplete={onComplete} />);

    expect(onFull).toHaveBeenCalledTimes(1);
    expect(onComplete).toHaveBeenCalledTimes(1);
    delete (window as Partial<Window>).matchMedia;
  });
});
