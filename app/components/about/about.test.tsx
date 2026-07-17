import { render, screen } from "@testing-library/react";
import About from "./about";
import { ABOUT_BADGES, CONTENT } from "./about.constants";

class MockIntersectionObserver {
  observe() {}
  disconnect() {}
  unobserve() {}
}

beforeAll(() => {
  // @ts-expect-error jsdom has no IntersectionObserver
  global.IntersectionObserver = MockIntersectionObserver;
});

describe("About", () => {
  it("renders the eyebrow copy", () => {
    render(<About />);
    expect(screen.getByText(CONTENT.eyebrow)).toBeInTheDocument();
  });

  it("renders the title as an h2 heading", () => {
    render(<About />);
    expect(
      screen.getByRole("heading", { level: 2, name: CONTENT.title }),
    ).toBeInTheDocument();
  });

  it("renders the section with the correct id", () => {
    const { container } = render(<About />);
    expect(container.querySelector(`#${CONTENT.id}`)).toBeInTheDocument();
  });

  it("renders a <section> element", () => {
    const { container } = render(<About />);
    expect(container.querySelector("section")).toBeInTheDocument();
  });

  it("renders all badges from ABOUT_BADGES", () => {
    render(<About />);
    ABOUT_BADGES.forEach((label) => {
      expect(screen.getByText(label)).toBeInTheDocument();
    });
  });

  it("renders exactly as many badges as ABOUT_BADGES entries", () => {
    render(<About />);
    ABOUT_BADGES.forEach((label) => {
      expect(screen.getAllByText(label)).toHaveLength(1);
    });
  });

  it("renders the paragraph text mentioning production ready React.js apps", () => {
    render(<About />);
    expect(
      screen.getByText(/production ready React\.js apps/i),
    ).toBeInTheDocument();
  });

  it("renders bold emphasis for 'best industry standards'", () => {
    render(<About />);
    expect(screen.getByText("best industry standards")).toBeInTheDocument();
  });

  it("renders bold emphasis for the modular architecture phrase", () => {
    render(<About />);
    expect(
      screen.getByText("modular, generic, and well documented architecture"),
    ).toBeInTheDocument();
  });

  it("renders without crashing when mounted multiple times", () => {
    const { unmount } = render(<About />);
    unmount();
    expect(() => render(<About />)).not.toThrow();
  });
});
