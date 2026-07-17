import { render, screen } from "@testing-library/react";
import Badge from "./badge";

describe("Badge", () => {
  it("renders the plain label text", () => {
    render(<Badge label="Available" />);
    expect(screen.getByText("Available")).toBeInTheDocument();
  });

  it("defaults color to signage", () => {
    render(<Badge label="Available" />);
    expect(screen.getByText("Available")).toHaveAttribute(
      "data-color",
      "signage",
    );
  });

  it("defaults borderColor to signage", () => {
    render(<Badge label="Available" />);
    expect(screen.getByText("Available")).toHaveAttribute(
      "data-border-color",
      "signage",
    );
  });

  it("defaults badgeBorder to roundish", () => {
    render(<Badge label="Available" />);
    expect(screen.getByText("Available")).toHaveAttribute(
      "data-badge-border",
      "roundish",
    );
  });

  it("applies a custom color", () => {
    render(<Badge label="Available" color="add" />);
    expect(screen.getByText("Available")).toHaveAttribute("data-color", "add");
  });

  it("applies a custom borderColor", () => {
    render(<Badge label="Available" borderColor="block-border" />);
    expect(screen.getByText("Available")).toHaveAttribute(
      "data-border-color",
      "block-border",
    );
  });

  it("applies a custom badgeBorder", () => {
    render(<Badge label="Available" badgeBorder="pill" />);
    expect(screen.getByText("Available")).toHaveAttribute(
      "data-badge-border",
      "pill",
    );
  });

  it("applies the rotate attribute when provided", () => {
    render(<Badge label="Available" rotate="left" />);
    expect(screen.getByText("Available")).toHaveAttribute(
      "data-rotate",
      "left",
    );
  });

  it("splits the label and renders both halves when letterBlink and breakingLetter are provided", () => {
    const { container } = render(
      <Badge label="On-Air" letterBlink breakingLetter="-" />,
    );
    expect(container.textContent).toBe("On-Air");
    expect(screen.getByText("-")).toBeInTheDocument();
  });

  it("marks the breaking letter span with data-letter-blink", () => {
    render(<Badge label="On-Air" letterBlink breakingLetter="-" />);
    expect(screen.getByText("-")).toHaveAttribute("data-letter-blink", "true");
  });

  it("sets data-border-blink on the wrapping element in the split-label path", () => {
    const { container } = render(
      <Badge label="On-Air" letterBlink breakingLetter="-" borderBlink />,
    );
    expect(container.querySelector("span[data-border-blink]")).toHaveAttribute(
      "data-border-blink",
      "true",
    );
  });

  it("does not split the label when letterBlink is false, even with a breakingLetter", () => {
    render(<Badge label="On-Air" breakingLetter="-" />);
    expect(screen.getByText("On-Air")).toBeInTheDocument();
  });

  it("does not split the label when breakingLetter is missing", () => {
    render(<Badge label="On-Air" letterBlink />);
    expect(screen.getByText("On-Air")).toBeInTheDocument();
  });

  it("renders as a span element via the open-sign Typography variant", () => {
    render(<Badge label="Available" />);
    expect(screen.getByText("Available").tagName).toBe("SPAN");
  });
});
