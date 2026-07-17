import { render, screen } from "@testing-library/react";
import Hero from "./hero";
import { DATA } from "./hero.constants";
import { BUTTONS } from "./heroButtons.constants";
import { SECTION_IDS } from "@/app/page.constants";

beforeAll(() => {
  class MockIntersectionObserver {
    observe = jest.fn();
    unobserve = jest.fn();
    disconnect = jest.fn();
  }
  // @ts-expect-error jsdom has no native IntersectionObserver
  global.IntersectionObserver = MockIntersectionObserver;

  Object.defineProperty(window, "matchMedia", {
    writable: true,
    value: jest.fn().mockImplementation((query) => ({
      matches: false,
      media: query,
      addEventListener: jest.fn(),
      removeEventListener: jest.fn(),
    })),
  });
});

describe("Hero", () => {
  it("renders a section with the hero section id", () => {
    render(<Hero />);
    expect(document.getElementById(SECTION_IDS.hero)).toBeInTheDocument();
  });

  it("renders every DATA entry's content", () => {
    render(<Hero />);
    DATA.forEach(({ content }) => {
      expect(screen.getByText(content)).toBeInTheDocument();
    });
  });

  it("renders the title as an h1", () => {
    render(<Hero />);
    expect(
      screen.getByRole("heading", { level: 1, name: "Kit G." }),
    ).toBeInTheDocument();
  });

  it("renders the hero buttons", () => {
    render(<Hero />);
    expect(
      screen.getByRole("button", { name: BUTTONS.email.label }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: BUTTONS.resume.label }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: BUTTONS.gitHub.label }),
    ).toBeInTheDocument();
  });

  it("renders a video background element", () => {
    const { container } = render(<Hero />);
    expect(container.querySelector("video")).toBeInTheDocument();
  });

  it("renders the section as a <section> element", () => {
    render(<Hero />);
    const section = document.getElementById(SECTION_IDS.hero);
    expect(section?.tagName).toBe("SECTION");
  });

  it("renders exactly one h1 heading", () => {
    render(<Hero />);
    expect(screen.getAllByRole("heading", { level: 1 })).toHaveLength(1);
  });

  it("renders the eyebrow text", () => {
    render(<Hero />);
    expect(screen.getByText("G · Lobby — now showing")).toBeInTheDocument();
  });

  it("renders the subtitle text", () => {
    render(<Hero />);
    expect(screen.getByText("Full-stack Web Developer")).toBeInTheDocument();
  });

  it("renders without crashing when mounted multiple times", () => {
    const { unmount } = render(<Hero />);
    unmount();
    expect(() => render(<Hero />)).not.toThrow();
  });
});
