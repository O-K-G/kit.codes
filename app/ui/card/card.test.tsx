import { render, screen } from "@testing-library/react";
import Card from "./card";

describe("Card", () => {
  const baseProps = {
    leftSlot: "2024",
    rightSlot: "Remote",
    title: "Software Engineer",
    subtitle: "Acme Inc.",
    leftSlotColor: "paper" as const,
  };

  it("renders the title", () => {
    render(<Card {...baseProps} />);
    expect(screen.getByText("Software Engineer")).toBeInTheDocument();
  });

  it("renders the subtitle", () => {
    render(<Card {...baseProps} />);
    expect(screen.getByText("Acme Inc.")).toBeInTheDocument();
  });

  it("renders the title as an h3 with card-heading variant", () => {
    render(<Card {...baseProps} />);
    const title = screen.getByText("Software Engineer");
    expect(title.tagName).toBe("H3");
    expect(title).toHaveAttribute("data-variant", "card-heading");
  });

  it("renders children inside the childrenContainer", () => {
    render(
      <Card {...baseProps}>
        <p>Extra details</p>
      </Card>,
    );
    expect(screen.getByText("Extra details")).toBeInTheDocument();
  });

  it("renders a TopCardBar with the leftSlot content", () => {
    render(<Card {...baseProps} />);
    expect(screen.getByText("2024")).toBeInTheDocument();
  });

  it("defaults to a div component", () => {
    const { container } = render(<Card {...baseProps} />);
    expect(container.querySelector("div.card, div[data-left-border]")).toBeTruthy();
  });

  it("renders as an li when component is li", () => {
    const { container } = render(<Card {...baseProps} component="li" />);
    expect(container.querySelector("li")).toBeInTheDocument();
  });

  it("sets data-left-border when leftBorder is provided", () => {
    const { container } = render(<Card {...baseProps} leftBorder="window" />);
    expect(container.firstChild).toHaveAttribute(
      "data-left-border",
      "window",
    );
  });

  it("sets data-hover-effect to true when hoverEffect is provided", () => {
    const { container } = render(<Card {...baseProps} hoverEffect />);
    expect(container.firstChild).toHaveAttribute("data-hover-effect", "true");
  });

  it("merges a custom className with the base style", () => {
    const { container } = render(
      <Card {...baseProps} className="custom-class" />,
    );
    expect(container.firstChild).toHaveClass("custom-class");
  });

  it("forwards arbitrary props such as id to the root element", () => {
    const { container } = render(<Card {...baseProps} id="my-card" />);
    expect(container.querySelector("#my-card")).toBeInTheDocument();
  });
});
