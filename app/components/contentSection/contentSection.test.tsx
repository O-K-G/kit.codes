import { render, screen } from "@testing-library/react";
import ContentSection from "./contentSection";

class MockIntersectionObserver {
  observe() {}
  disconnect() {}
  unobserve() {}
}

beforeAll(() => {
  // @ts-expect-error jsdom has no IntersectionObserver
  global.IntersectionObserver = MockIntersectionObserver;
});

describe("ContentSection", () => {
  it("renders the eyebrow text", () => {
    render(<ContentSection id="sec-1" eyebrow="1 · Test" title="Title" />);
    expect(screen.getByText("1 · Test")).toBeInTheDocument();
  });

  it("renders the title as an h2", () => {
    render(<ContentSection id="sec-1" eyebrow="Eyebrow" title="My Title" />);
    expect(
      screen.getByRole("heading", { level: 2, name: "My Title" }),
    ).toBeInTheDocument();
  });

  it("renders the paragraph when provided", () => {
    render(
      <ContentSection
        id="sec-1"
        eyebrow="Eyebrow"
        title="Title"
        paragraph="Some paragraph text"
      />,
    );
    expect(screen.getByText("Some paragraph text")).toBeInTheDocument();
  });

  it("does not render a paragraph element when paragraph is omitted", () => {
    const { container } = render(
      <ContentSection id="sec-1" eyebrow="Eyebrow" title="Title" />,
    );
    const paragraphs = container.querySelectorAll("p");
    // eyebrow is also a <p>, title is h2 - only 1 <p> (eyebrow) expected
    expect(paragraphs).toHaveLength(1);
  });

  it("renders slot content when provided", () => {
    render(
      <ContentSection
        id="sec-1"
        eyebrow="Eyebrow"
        title="Title"
        slot={<div data-testid="my-slot">Slot content</div>}
      />,
    );
    expect(screen.getByTestId("my-slot")).toBeInTheDocument();
  });

  it("does not render slot wrapper when slot is omitted", () => {
    render(<ContentSection id="sec-1" eyebrow="Eyebrow" title="Title" />);
    expect(screen.queryByTestId("my-slot")).not.toBeInTheDocument();
  });

  it("applies the provided id to the underlying section", () => {
    const { container } = render(
      <ContentSection id="my-section-id" eyebrow="Eyebrow" title="Title" />,
    );
    expect(container.querySelector("#my-section-id")).toBeInTheDocument();
  });

  it("merges a custom className with the default contentSection styles", () => {
    const { container } = render(
      <ContentSection
        id="sec-1"
        eyebrow="Eyebrow"
        title="Title"
        className="custom-class"
      />,
    );
    const section = container.querySelector("section");
    expect(section?.className).toEqual(expect.stringContaining("custom-class"));
  });

  it("passes bottomBorder prop through to the underlying Section", () => {
    const { container } = render(
      <ContentSection
        id="sec-1"
        eyebrow="Eyebrow"
        title="Title"
        bottomBorder={false}
      />,
    );
    const section = container.querySelector("section");
    expect(section).toHaveAttribute("data-bottom-border", "false");
  });

  it("renders a single <section> element", () => {
    const { container } = render(
      <ContentSection id="sec-1" eyebrow="Eyebrow" title="Title" />,
    );
    expect(container.querySelectorAll("section")).toHaveLength(1);
  });
});
