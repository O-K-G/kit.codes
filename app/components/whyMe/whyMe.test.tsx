import { render, screen } from "@testing-library/react";
import WhyMe from "./whyMe";
import { CARDS, EYEBROW, TITLE } from "./whyMe.constants";

class MockIntersectionObserver {
  observe() {}
  disconnect() {}
  unobserve() {}
}

beforeAll(() => {
  // @ts-expect-error jsdom has no IntersectionObserver
  global.IntersectionObserver = MockIntersectionObserver;
});

describe("WhyMe", () => {
  it("renders the eyebrow text", () => {
    render(<WhyMe />);
    expect(screen.getByText(EYEBROW)).toBeInTheDocument();
  });

  it("renders the title as an h2", () => {
    render(<WhyMe />);
    expect(
      screen.getByRole("heading", { level: 2, name: TITLE }),
    ).toBeInTheDocument();
  });

  it("renders one card per CARDS entry", () => {
    const { container } = render(<WhyMe />);
    expect(container.querySelectorAll("li[data-hover-effect]")).toHaveLength(
      CARDS.length,
    );
  });

  it("renders each card's title", () => {
    render(<WhyMe />);
    CARDS.forEach((card) => {
      expect(screen.getByText(card.title)).toBeInTheDocument();
    });
  });

  it("renders each card's subtitle", () => {
    render(<WhyMe />);
    CARDS.forEach((card) => {
      expect(screen.getByText(card.subtitle)).toBeInTheDocument();
    });
  });

  it("renders each card's leftSlot unit label", () => {
    render(<WhyMe />);
    CARDS.forEach((card) => {
      expect(screen.getByText(card.leftSlot)).toBeInTheDocument();
    });
  });

  it("marks every card with hoverEffect enabled", () => {
    const { container } = render(<WhyMe />);
    const cards = container.querySelectorAll("li[data-hover-effect]");
    cards.forEach((card) => {
      expect(card).toHaveAttribute("data-hover-effect", "true");
    });
  });

  it("renders every badge listed for each card", () => {
    render(<WhyMe />);
    CARDS.forEach((card) => {
      card.badges.forEach((badgeLabel) => {
        expect(screen.getAllByText(badgeLabel).length).toBeGreaterThan(0);
      });
    });
  });

  it("renders the 'Open' badge for every card's rightSlot", () => {
    const { container } = render(<WhyMe />);
    expect(container.querySelectorAll("[data-rotate]")).toHaveLength(
      CARDS.length,
    );
  });

  it("renders the cards inside a <ul>", () => {
    const { container } = render(<WhyMe />);
    expect(container.querySelector("ul")).toBeInTheDocument();
  });
});
