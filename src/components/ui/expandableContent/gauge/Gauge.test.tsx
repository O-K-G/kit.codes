import { fireEvent, render } from "@testing-library/react";
import "@testing-library/jest-dom";
import Gauge from "@ui/expandableContent/gauge/Gauge";
import styles from "@ui/expandableContent/gauge/Gauge.module.css";

function renderGauge(running: boolean, onComplete = jest.fn()) {
  const { container, rerender } = render(<Gauge running={running} onComplete={onComplete} />);
  const gauge = container.firstElementChild as HTMLElement;
  const fill = container.querySelector(`.${styles.gauge} > .${styles.ring} > .${styles.fill}`) as HTMLElement;
  const countText = container.querySelector(`.${styles.countText}`) as HTMLElement;
  return { gauge, fill, countText, onComplete, rerender };
}

describe("Gauge", () => {
  it("is hidden from screen readers, and takes a className", () => {
    const { container } = render(<Gauge running={false} className="placed" />);

    expect(container.firstElementChild).toHaveAttribute("aria-hidden", "true");
    expect(container.firstElementChild).toHaveClass(styles.gauge, "placed");
  });

  it("runs its animations only while running", () => {
    const { gauge, rerender } = renderGauge(false);
    const animated = gauge.querySelectorAll("[data-running]");

    expect(animated.length).toBeGreaterThan(0);
    animated.forEach((element) => expect(element).toHaveAttribute("data-running", "false"));

    rerender(<Gauge running />);
    animated.forEach((element) => expect(element).toHaveAttribute("data-running", "true"));
  });

  it("completes once the count has blinked, not when the rings fill", () => {
    const { fill, countText, onComplete } = renderGauge(true);

    fireEvent.animationEnd(fill);
    expect(onComplete).not.toHaveBeenCalled();

    fireEvent.animationEnd(countText);
    expect(onComplete).toHaveBeenCalledTimes(1);
  });

  it("reports when the count hits 100%, not when its blinks end", () => {
    const onFull = jest.fn();
    const { container } = render(<Gauge running onFull={onFull} />);
    const count = container.querySelector(`.${styles.count}`) as HTMLElement;
    const countText = container.querySelector(`.${styles.countText}`) as HTMLElement;

    fireEvent.animationEnd(countText);
    expect(onFull).not.toHaveBeenCalled();

    fireEvent.animationEnd(count);
    expect(onFull).toHaveBeenCalledTimes(1);
  });
});
