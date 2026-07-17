import { render, screen } from "@testing-library/react";
import Experience from "./experience";
import { CARDS, CONTENT } from "./experience.constants";

class MockIntersectionObserver {
  observe() {}
  disconnect() {}
  unobserve() {}
}

beforeAll(() => {
  // @ts-expect-error jsdom has no IntersectionObserver
  global.IntersectionObserver = MockIntersectionObserver;
});

describe("Experience", () => {
  it("renders the eyebrow text", () => {
    render(<Experience />);
    expect(screen.getByText(CONTENT.eyebrow)).toBeInTheDocument();
  });

  it("renders the title as an h2", () => {
    render(<Experience />);
    expect(
      screen.getByRole("heading", { level: 2, name: CONTENT.title }),
    ).toBeInTheDocument();
  });

  it("renders the section with the correct id", () => {
    const { container } = render(<Experience />);
    expect(container.querySelector(`#${CONTENT.id}`)).toBeInTheDocument();
  });

  it("renders one card per CARDS entry", () => {
    const { container } = render(<Experience />);
    expect(container.querySelectorAll("li[data-left-border]")).toHaveLength(
      CARDS.length,
    );
  });

  it("renders each card's title", () => {
    render(<Experience />);
    CARDS.forEach((card) => {
      expect(screen.getByText(card.title)).toBeInTheDocument();
    });
  });

  it("renders each card's subtitle", () => {
    render(<Experience />);
    CARDS.forEach((card) => {
      expect(screen.getAllByText(card.subtitle).length).toBeGreaterThan(0);
    });
  });

  it("renders each card's date range as rightSlot", () => {
    render(<Experience />);
    CARDS.forEach((card) => {
      expect(screen.getByText(card.rightSlot)).toBeInTheDocument();
    });
  });

  it("renders each card's leftSlot company name", () => {
    render(<Experience />);
    CARDS.forEach((card) => {
      expect(screen.getAllByText(card.leftSlot).length).toBeGreaterThan(0);
    });
  });

  it("marks the last card with a 'signage' left border and others 'window'", () => {
    const { container } = render(<Experience />);
    const cards = Array.from(
      container.querySelectorAll("li[data-left-border]"),
    );
    cards.forEach((card, index) => {
      const expected = index === cards.length - 1 ? "signage" : "window";
      expect(card).toHaveAttribute("data-left-border", expected);
    });
  });

  it("renders bullet list items for each card's list entries", () => {
    render(<Experience />);
    const firstCardListItems = CARDS[0].list ?? [];
    firstCardListItems.forEach((item) => {
      expect(screen.getByText(item)).toBeInTheDocument();
    });
  });

  it("renders the cards inside a <ul>", () => {
    const { container } = render(<Experience />);
    expect(container.querySelector("ul")).toBeInTheDocument();
  });
});
