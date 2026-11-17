import { fireEvent, render } from "@testing-library/react";
import "@testing-library/jest-dom";
import Gauge from "@ui/expandableContent/gauge/Gauge";
import styles from "@ui/expandableContent/gauge/Gauge.module.css";
import { fireAfterAnimationEnd } from "@ui/expandableContent/gauge/fireAfterAnimationEnd";

function renderGauge(running: boolean, onFull = jest.fn(), onComplete = jest.fn()) {
  const { container, rerender } = render(
    <Gauge running={running} onFull={onFull} onComplete={onComplete} />
  );
  const gauge = container.firstElementChild as HTMLElement;
  const inner = container.querySelector(`.${styles.inner}`) as HTMLElement;
  const count = container.querySelector(`.${styles.count}`) as HTMLElement;
  return { gauge, inner, count, onFull, onComplete, rerender };
}

describe("Gauge", () => {
  it("is hidden from screen readers, and takes a className", () => {
    const { container } = render(<Gauge running={false} className="placed" />);

    expect(container.firstElementChild).toHaveAttribute("aria-hidden", "true");
    expect(container.firstElementChild).toHaveClass(styles.gauge, "placed");
  });

  it("runs its animations only while running (the CSS keys them on the root)", () => {
    const { gauge, rerender } = renderGauge(false);
    expect(gauge).toHaveAttribute("data-running", "false");

    rerender(<Gauge running />);
    expect(gauge).toHaveAttribute("data-running", "true");
  });

  it("completes once the count's text has blinked, not when the rings fill", () => {
    const { gauge, inner, count, onComplete } = renderGauge(true);

    fireAfterAnimationEnd(gauge);
    fireAfterAnimationEnd(inner);
    expect(onComplete).not.toHaveBeenCalled();

    fireAfterAnimationEnd(count);
    expect(onComplete).toHaveBeenCalledTimes(1);
  });

  it("reports when the count hits 100%, not when its text's blinks end", () => {
    const { count, onFull, onComplete } = renderGauge(true);

    fireAfterAnimationEnd(count);
    expect(onFull).not.toHaveBeenCalled();

    fireEvent.animationEnd(count);
    expect(onFull).toHaveBeenCalledTimes(1);
    expect(onComplete).toHaveBeenCalledTimes(1);
  });
});
