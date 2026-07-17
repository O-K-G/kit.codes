import { render, screen } from "@testing-library/react";
import Badges from "./badges";
import { ABOUT_BADGES } from "./about.constants";

describe("Badges", () => {
  it("renders one badge per entry in ABOUT_BADGES", () => {
    render(<Badges />);
    ABOUT_BADGES.forEach((label) => {
      expect(screen.getByText(label)).toBeInTheDocument();
    });
  });

  it("renders exactly ABOUT_BADGES.length badge elements", () => {
    const { container } = render(<Badges />);
    const badgeSpans = container.querySelectorAll("[data-badge-border]");
    expect(badgeSpans).toHaveLength(ABOUT_BADGES.length);
  });

  it("renders badges with badgeBorder='pill'", () => {
    const { container } = render(<Badges />);
    const badgeSpans = container.querySelectorAll("[data-badge-border]");
    badgeSpans.forEach((el) => {
      expect(el).toHaveAttribute("data-badge-border", "pill");
    });
  });

  it("renders badges with borderColor='block-border'", () => {
    const { container } = render(<Badges />);
    const badgeSpans = container.querySelectorAll("[data-border-color]");
    badgeSpans.forEach((el) => {
      expect(el).toHaveAttribute("data-border-color", "block-border");
    });
  });

  it("renders badges with color='mist'", () => {
    const { container } = render(<Badges />);
    const badgeSpans = container.querySelectorAll("[data-color]");
    badgeSpans.forEach((el) => {
      expect(el).toHaveAttribute("data-color", "mist");
    });
  });

  it("renders the experience-years badge first", () => {
    render(<Badges />);
    expect(screen.getByText(ABOUT_BADGES[0])).toBeInTheDocument();
  });

  it("renders the 'React & Next.js' badge", () => {
    render(<Badges />);
    expect(screen.getByText("React & Next.js")).toBeInTheDocument();
  });

  it("renders the 'WCAG & AODA' badge", () => {
    render(<Badges />);
    expect(screen.getByText("WCAG & AODA")).toBeInTheDocument();
  });

  it("wraps badges in a container div", () => {
    const { container } = render(<Badges />);
    expect(container.firstChild?.nodeName).toBe("DIV");
  });

  it("renders without crashing on remount", () => {
    const { unmount } = render(<Badges />);
    unmount();
    expect(() => render(<Badges />)).not.toThrow();
  });
});
