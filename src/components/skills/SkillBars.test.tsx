import { act, render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import SkillBars from "@components/skills/SkillBars";
import { SKILLS, SKILL_MAX_SEGMENTS } from "@constants/skills";
import styles from "@components/skills/SkillBars.module.css";

/** jsdom has no IntersectionObserver: a mock whose visibility the test drives. */
let setVisible: (visible: boolean) => void = () => undefined;

beforeEach(() => {
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

  it("fills the bars once in view, and keeps them filled", () => {
    const { container } = render(<SkillBars />);
    const fills = container.querySelectorAll(`.${styles.fill}`);

    fills.forEach((fill) => expect(fill).toHaveAttribute("data-filling", "false"));

    setVisible(true);
    fills.forEach((fill) => expect(fill).toHaveAttribute("data-filling", "true"));

    setVisible(false);
    fills.forEach((fill) => expect(fill).toHaveAttribute("data-filling", "true"));
  });
});
