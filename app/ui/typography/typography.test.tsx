import { render, screen } from "@testing-library/react";
import Typography from "./typography";

describe("Typography", () => {
  it("renders the children", () => {
    render(<Typography>Hello</Typography>);
    expect(screen.getByText("Hello")).toBeInTheDocument();
  });

  it("defaults to a p element", () => {
    render(<Typography>Hello</Typography>);
    expect(screen.getByText("Hello").tagName).toBe("P");
  });

  it("defaults variant to body", () => {
    render(<Typography>Hello</Typography>);
    expect(screen.getByText("Hello")).toHaveAttribute("data-variant", "body");
  });

  it("defaults color to paper", () => {
    render(<Typography>Hello</Typography>);
    expect(screen.getByText("Hello")).toHaveAttribute("data-color", "paper");
  });

  it("renders as a span when component is span", () => {
    render(<Typography component="span">Hello</Typography>);
    expect(screen.getByText("Hello").tagName).toBe("SPAN");
  });

  it("renders as an h1 when component is h1", () => {
    render(<Typography component="h1">Hello</Typography>);
    expect(screen.getByText("Hello").tagName).toBe("H1");
  });

  it("renders as a label when component is label", () => {
    render(<Typography component="label">Hello</Typography>);
    expect(screen.getByText("Hello").tagName).toBe("LABEL");
  });

  it("applies a custom variant", () => {
    render(<Typography variant="hero-name">Hello</Typography>);
    expect(screen.getByText("Hello")).toHaveAttribute(
      "data-variant",
      "hero-name",
    );
  });

  it("applies a custom color", () => {
    render(<Typography color="sky-deep">Hello</Typography>);
    expect(screen.getByText("Hello")).toHaveAttribute(
      "data-color",
      "sky-deep",
    );
  });

  it("merges a custom className with the base style", () => {
    render(<Typography className="custom-class">Hello</Typography>);
    expect(screen.getByText("Hello").className).toContain("custom-class");
  });

  it("forwards htmlFor when component is label", () => {
    render(
      <Typography component="label" htmlFor="email-input">
        Email
      </Typography>,
    );
    expect(screen.getByText("Email")).toHaveAttribute("for", "email-input");
  });

  it("forwards aria-live", () => {
    render(<Typography aria-live="polite">Hello</Typography>);
    expect(screen.getByText("Hello")).toHaveAttribute("aria-live", "polite");
  });

  it("forwards id", () => {
    render(<Typography id="greeting">Hello</Typography>);
    expect(screen.getByText("Hello")).toHaveAttribute("id", "greeting");
  });

  it("forwards dir", () => {
    render(<Typography dir="rtl">Hello</Typography>);
    expect(screen.getByText("Hello")).toHaveAttribute("dir", "rtl");
  });
});
