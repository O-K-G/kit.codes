import { act, fireEvent, render, screen, within } from "@testing-library/react";
import "@testing-library/jest-dom";
import SkillBars from "@components/skills/SkillBars";
import { SKILL_GROUPS, SKILL_MAX_SEGMENTS, SKILL_SHORT_NAMES, skillChevrons, skillSegments } from "@constants/skills";
import styles from "@components/skills/SkillBars.module.css";

const GROUP_NAMES = {
  frontEnd: "Front-end",
  backEnd: "Back-end",
  databases: "Databases",
  general: "General",
};

/** Every skill and its level in percent, in order */
const SKILLS = SKILL_GROUPS.flatMap(({ skills }) => Object.entries(skills));

const renderBars = () => render(<SkillBars groupNames={GROUP_NAMES} />);

/** jsdom has no IntersectionObserver: a mock whose visibility the test drives. */
let setVisible: (visible: boolean) => void = () => undefined;

/** jsdom has no PointerEvent either: a mouse event that carries its pointer type */
class MockPointerEvent extends MouseEvent {
  pointerType: string;

  constructor(type: string, init: PointerEventInit = {}) {
    super(type, init);
    this.pointerType = init.pointerType ?? "";
  }
}
window.PointerEvent = MockPointerEvent as unknown as typeof PointerEvent;

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
  it("has short names for phones, hidden from screen readers: meters keep the full names", () => {
    renderBars();

    expect(Object.keys(SKILL_SHORT_NAMES).length).toBeGreaterThan(0);
    Object.entries(SKILL_SHORT_NAMES).forEach(([name, shortName]) => {
      expect(screen.getByRole("meter", { name })).toBeInTheDocument();
      const short = screen.getByText(shortName as string);
      expect(short).toHaveClass(styles.shortName);
      expect(short).toHaveAttribute("aria-hidden", "true");
      expect(screen.getByText(name)).toHaveClass(styles.fullName);
    });
  });

  it("shows every skill as a meter named by the skill, valued in percent", () => {
    renderBars();
    const meters = screen.getAllByRole("meter");

    expect(meters).toHaveLength(SKILLS.length);
    SKILLS.forEach(([name, percent]) => {
      const meter = screen.getByRole("meter", { name });

      expect(meter).toHaveAttribute("aria-valuenow", `${percent}`);
      expect(meter).toHaveAttribute("aria-valuetext", `${percent}%`);
    });
  });

  it("lists each group's skills under its name", () => {
    renderBars();

    SKILL_GROUPS.forEach(({ id, skills }) => {
      const name = GROUP_NAMES[id];
      const list = screen.getByRole("list", { name });

      expect(screen.getByRole("heading", { name })).toBeInTheDocument();
      expect(within(list).getAllByRole("meter")).toHaveLength(Object.keys(skills).length);
      Object.keys(skills).forEach((skill) =>
        expect(within(list).getByRole("meter", { name: skill })).toBeInTheDocument()
      );
    });
  });

  it("lights a whole number of segments for every level", () => {
    SKILLS.forEach(([, percent]) =>
      expect(Number.isInteger((percent / 100) * SKILL_MAX_SEGMENTS)).toBe(true)
    );
  });

  it("fills the bars once in view, one row after another, and keeps them filled", () => {
    jest.useFakeTimers();
    const { container } = renderBars();
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
    const { container } = renderBars();
    const fills = container.querySelectorAll(`.${styles.segments}`);

    setVisible(true);
    fills.forEach((fill) => expect(fill).toHaveAttribute("data-filling", "true"));
  });

  it("draws each bar as one element, not one per segment", () => {
    renderBars();
    const [name] = SKILLS[0];
    const bar = screen.getByRole("meter", { name });

    expect(bar.querySelector(`.${styles.segments}`)).toBeInTheDocument();
    expect(bar.querySelectorAll("span")).toHaveLength(0);
  });

  describe("hovering a segment", () => {
    /** The first skill's bar that isn't full, 500px wide from the left edge, and a pointer at a segment's middle */
    const setup = () => {
      renderBars();
      const [name, percent] = SKILLS.find(([, level]) => level < 100)!;
      const level = skillSegments(percent);
      const segments = screen
        .getByRole("meter", { name })
        .querySelector(`.${styles.segments}`) as HTMLElement;
      segments.getBoundingClientRect = () => ({ left: 0, width: 500, height: 20 }) as DOMRect;

      const { tip, step, arm } = skillChevrons(500, 20);
      const hover = (segment: number, target: Element = segments) =>
        fireEvent.pointerMove(target, {
          pointerType: "mouse",
          clientX: segment * step + tip / 2 + arm / 2,
        });
      const highlight = () => segments.querySelector(`.${styles.highlight}`);

      return { segments, level, hover, highlight };
    };

    it("lifts a lit segment, showing its place on the scale", () => {
      const { hover, highlight } = setup();

      // The 4th of 20 segments: 20% of the scale
      hover(3);
      expect(highlight()).toHaveAttribute("data-active", "true");
      expect(highlight()).toHaveTextContent("20%");
      expect(highlight()).toHaveAttribute("aria-hidden", "true");
    });

    it("ignores the segments that aren't lit", () => {
      const { hover, highlight, level } = setup();

      hover(level);
      expect(highlight()).not.toBeInTheDocument();
    });

    it("lets the segment ease back once the pointer leaves", () => {
      const { segments, hover, highlight } = setup();

      hover(9);
      fireEvent.pointerLeave(segments);
      expect(highlight()).toHaveAttribute("data-active", "false");
    });

    it("keeps the segment lifted while its tooltip is hovered", () => {
      const { hover, highlight } = setup();

      // The 4th of 20 segments: 20% of the scale
      hover(3);
      hover(20, highlight() as Element);
      expect(highlight()).toHaveTextContent("20%");
    });

    it("counts the segments from the right in a right-to-left page, where the bar is mirrored", () => {
      document.documentElement.setAttribute("dir", "rtl");
      try {
        const { segments, highlight } = setup();
        segments.getBoundingClientRect = () =>
          ({ left: 0, right: 500, width: 500, height: 20 }) as DOMRect;
        const { tip, step, arm } = skillChevrons(500, 20);

        // The 4th segment from the right: 20% of the scale
        fireEvent.pointerMove(segments, {
          pointerType: "mouse",
          clientX: 500 - (3 * step + tip / 2 + arm / 2),
        });
        expect(highlight()).toHaveTextContent("20%");
      } finally {
        document.documentElement.removeAttribute("dir");
      }
    });

    it("ignores touch", () => {
      const { segments, highlight } = setup();

      fireEvent.pointerMove(segments, { pointerType: "touch", clientX: 50 });
      expect(highlight()).not.toBeInTheDocument();
    });
  });
});
