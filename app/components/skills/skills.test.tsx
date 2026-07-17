import { render, screen } from "@testing-library/react";
import Skills from "./skills";
import {
  ADDITIONAL_DETAILS_LABEL,
  ADDITIONAL_SKILLS,
  EYEBROW,
  SKILLS,
  TITLE,
  TOP_BAR,
  YEARS_LABEL,
} from "./skills.constants";

class MockIntersectionObserver {
  observe() {}
  disconnect() {}
  unobserve() {}
}

beforeAll(() => {
  // @ts-expect-error jsdom has no IntersectionObserver
  global.IntersectionObserver = MockIntersectionObserver;
});

describe("Skills", () => {
  it("renders the eyebrow text", () => {
    render(<Skills />);
    expect(screen.getByText(EYEBROW)).toBeInTheDocument();
  });

  it("renders the title as an h2", () => {
    render(<Skills />);
    expect(
      screen.getByRole("heading", { level: 2, name: TITLE }),
    ).toBeInTheDocument();
  });

  it("renders the top bar left slot label", () => {
    render(<Skills />);
    expect(screen.getByText(TOP_BAR.leftSlot)).toBeInTheDocument();
  });

  it("renders the top bar right slot as a badge", () => {
    render(<Skills />);
    expect(screen.getByText(TOP_BAR.rightSlot)).toBeInTheDocument();
  });

  it("renders one progress bar per SKILLS entry", () => {
    const { container } = render(<Skills />);
    expect(container.querySelectorAll("progress")).toHaveLength(
      SKILLS.length,
    );
  });

  it("renders each skill's name as a label", () => {
    render(<Skills />);
    SKILLS.forEach(({ skill }) => {
      expect(screen.getByText(skill)).toBeInTheDocument();
    });
  });

  it("renders each skill's proficiency as the progress value", () => {
    const { container } = render(<Skills />);
    const bars = Array.from(container.querySelectorAll("progress"));
    SKILLS.forEach(({ proficiency }, index) => {
      expect(bars[index]).toHaveAttribute("value", proficiency);
    });
  });

  it("renders each skill's years label suffixed with YEARS_LABEL", () => {
    render(<Skills />);
    SKILLS.forEach(({ years }) => {
      expect(
        screen.getAllByText(`${years} ${YEARS_LABEL}`).length,
      ).toBeGreaterThan(0);
    });
  });

  it("renders the additional details label", () => {
    render(<Skills />);
    expect(screen.getByText(ADDITIONAL_DETAILS_LABEL)).toBeInTheDocument();
  });

  it("renders the additional skills list text", () => {
    render(<Skills />);
    expect(screen.getByText(ADDITIONAL_SKILLS)).toBeInTheDocument();
  });

  it("gives each progress bar a unique id derived from the skill name", () => {
    const { container } = render(<Skills />);
    const bars = Array.from(container.querySelectorAll("progress"));
    const ids = bars.map((bar) => bar.id);
    expect(new Set(ids).size).toBe(ids.length);
  });
});
