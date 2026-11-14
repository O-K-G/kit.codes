import { act, render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import SkillBars from "@components/skills/SkillBars";
import { SKILLS, SKILL_MAX_SEGMENTS } from "@constants/skills";
import styles from "@components/skills/SkillBars.module.css";

/** jsdom has no IntersectionObserver: a mock whose visibility the test drives. */
let setVisible: (visible: boolean) => void = () => undefined;

/** jsdom has no matchMedia either: a mock answering whether reduced motion is asked for */
const mockReducedMotion = (reduce: boolean) => {
  window.matchMedia = jest.fn(
    (query: string) => ({ matches: reduce && query.includes("reduce") }) as MediaQueryList
  );
};

beforeEach(() => {
  mockReducedMotion(false);
  window.IntersectionObserver = jest.fn(
    (callback: IntersectionObserverCallback) => {
      setVisible = (visible) =>
        act(() =>
          callback(
            [{ isIntersecting: visible } as IntersectionObserverEntry],
            {} as IntersectionObserver
          )
        );
      return { observe: jest.fn(), disconnect: jest.fn() } as unknown as IntersectionObserver;
    }
  ) as unknown as typeof IntersectionObserver;
});

describe("SkillBars", () => {
  it("shows every skill as a meter named by the skill, valued in percent", () => {
    render(<SkillBars />);
    const meters = screen.getAllByRole("meter");

    expect(meters).toHaveLength(Object.keys(SKILLS).length);
    Object.entries(SKILLS).forEach(([name, level]) => {
      const meter = screen.getByRole("meter", { name });
      const percent = Math.round((level / SKILL_MAX_SEGMENTS) * 100);

      expect(meter).toHaveAttribute("aria-valuenow", `${percent}`);
      expect(meter).toHaveAttribute("aria-valuetext", `${percent}%`);
    });
  });

  it("fills the bars once in view, one row after another, and keeps them filled", () => {
    jest.useFakeTimers();
    const { container } = render(<SkillBars />);
    const fills = Array.from(container.querySelectorAll(`.${styles.segments}`));

    fills.forEach((fill) => expect(fill).toHaveAttribute("data-filling", "false"));

    setVisible(true);
    expect(fills[0]).toHaveAttribute("data-filling", "true");
    expect(fills[1]).toHaveAttribute("data-filling", "false");

    act(() => jest.advanceTimersByTime(80));
    expect(fills[1]).toHaveAttribute("data-filling", "true");

    act(() => jest.advanceTimersByTime(80 * fills.length));
    fills.forEach((fill) => expect(fill).toHaveAttribute("data-filling", "true"));

    setVisible(false);
    fills.forEach((fill) => expect(fill).toHaveAttribute("data-filling", "true"));
    jest.useRealTimers();
  });

  it("fills every row at once with reduced motion", () => {
    mockReducedMotion(true);
    const { container } = render(<SkillBars />);
    const fills = container.querySelectorAll(`.${styles.segments}`);

    setVisible(true);
    fills.forEach((fill) => expect(fill).toHaveAttribute("data-filling", "true"));
  });

  it("draws each bar as its segments, lit up to the skill's value", () => {
    const { container } = render(<SkillBars />);
    const [name, level] = Object.entries(SKILLS)[0];
    const bar = screen.getByRole("meter", { name });
    const segments = bar.querySelectorAll("span");

    expect(container.querySelector(`.${styles.segments}`)).toBeInTheDocument();
    expect(segments).toHaveLength(SKILL_MAX_SEGMENTS);
    expect(bar.querySelectorAll('span[data-on="true"]')).toHaveLength(level);
  });
});
