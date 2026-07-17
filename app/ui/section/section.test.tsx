import { render, screen } from "@testing-library/react";
import Section from "./section";

const observeSpy = jest.fn();

class MockIntersectionObserver {
  observe = observeSpy;
  disconnect = jest.fn();
  unobserve = jest.fn();
}

beforeAll(() => {
  (global as unknown as { IntersectionObserver: unknown }).IntersectionObserver =
    MockIntersectionObserver;
});

beforeEach(() => {
  observeSpy.mockClear();
});

describe("Section", () => {
  it("renders a <section> element", () => {
    const { container } = render(
      <Section id="about">
        <p>content</p>
      </Section>,
    );
    expect(container.querySelector("section")).toBeInTheDocument();
  });

  it("applies the id to the section element", () => {
    render(
      <Section id="about">
        <p>content</p>
      </Section>,
    );
    expect(document.getElementById("about")?.tagName).toBe("SECTION");
  });

  it("renders children inside the section", () => {
    render(
      <Section id="about">
        <p>Hello world</p>
      </Section>,
    );
    expect(screen.getByText("Hello world")).toBeInTheDocument();
  });

  it("defaults data-bottom-border to true", () => {
    render(
      <Section id="about">
        <p>content</p>
      </Section>,
    );
    expect(document.getElementById("about")).toHaveAttribute(
      "data-bottom-border",
      "true",
    );
  });

  it("sets data-bottom-border to false when bottomBorder=false", () => {
    render(
      <Section id="about" bottomBorder={false}>
        <p>content</p>
      </Section>,
    );
    expect(document.getElementById("about")).toHaveAttribute(
      "data-bottom-border",
      "false",
    );
  });

  it("starts with data-in-view=false", () => {
    render(
      <Section id="about">
        <p>content</p>
      </Section>,
    );
    expect(document.getElementById("about")).toHaveAttribute("data-in-view", "false");
  });

  it("applies a custom className alongside the default styles", () => {
    render(
      <Section id="about" className="custom-class">
        <p>content</p>
      </Section>,
    );
    expect(document.getElementById("about")).toHaveClass("custom-class");
  });

  it("passes rest props through to the section element", () => {
    render(
      <Section id="about" data-testid="about-section">
        <p>content</p>
      </Section>,
    );
    expect(screen.getByTestId("about-section")).toBeInTheDocument();
  });

  it("registers an IntersectionObserver for the section via SectionObserver/useFadeIn", () => {
    render(
      <Section id="about">
        <p>content</p>
      </Section>,
    );
    expect(observeSpy).toHaveBeenCalledWith(document.getElementById("about"));
  });

  it("renders distinct sections with distinct ids without collision", () => {
    render(
      <>
        <Section id="one">
          <p>One</p>
        </Section>
        <Section id="two">
          <p>Two</p>
        </Section>
      </>,
    );
    expect(document.getElementById("one")).toBeInTheDocument();
    expect(document.getElementById("two")).toBeInTheDocument();
  });

  it("renders multiple children", () => {
    render(
      <Section id="about">
        <p>First</p>
        <p>Second</p>
      </Section>,
    );
    expect(screen.getByText("First")).toBeInTheDocument();
    expect(screen.getByText("Second")).toBeInTheDocument();
  });
});
