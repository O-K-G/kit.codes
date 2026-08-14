import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import Button from "./button";

describe("Button", () => {
  it("renders its children", () => {
    render(<Button>Submit</Button>);
    expect(screen.getByText("Submit")).toBeInTheDocument();
  });

  it("renders as a button element", () => {
    render(<Button>Submit</Button>);
    expect(screen.getByRole("button")).toBeInTheDocument();
  });

  it("defaults type to button", () => {
    render(<Button>Submit</Button>);
    expect(screen.getByRole("button")).toHaveAttribute("type", "button");
  });

  it("allows overriding type to submit", () => {
    render(<Button type="submit">Submit</Button>);
    expect(screen.getByRole("button")).toHaveAttribute("type", "submit");
  });

  it("defaults variant to outline-paper", () => {
    render(<Button>Submit</Button>);
    expect(screen.getByRole("button")).toHaveAttribute(
      "data-variant",
      "outline-paper",
    );
  });

  it("applies the fill-sky-deep variant", () => {
    render(<Button variant="fill-sky-deep">Submit</Button>);
    expect(screen.getByRole("button")).toHaveAttribute(
      "data-variant",
      "fill-sky-deep",
    );
  });

  it("applies the buzzer variant", () => {
    render(<Button variant="buzzer">Submit</Button>);
    expect(screen.getByRole("button")).toHaveAttribute(
      "data-variant",
      "buzzer",
    );
  });

  it("merges a custom className with the base style", () => {
    render(<Button className="custom-class">Submit</Button>);
    expect(screen.getByRole("button").className).toContain("custom-class");
  });

  it("calls onClick when clicked", async () => {
    const onClick = jest.fn();
    render(<Button onClick={onClick}>Submit</Button>);
    await userEvent.click(screen.getByRole("button"));
    expect(onClick).toHaveBeenCalledTimes(1);
  });

  it("respects the disabled attribute", () => {
    render(<Button disabled>Submit</Button>);
    expect(screen.getByRole("button")).toBeDisabled();
  });

  it("does not call onClick when disabled", async () => {
    const onClick = jest.fn();
    render(
      <Button disabled onClick={onClick}>
        Submit
      </Button>,
    );
    await userEvent.click(screen.getByRole("button"));
    expect(onClick).not.toHaveBeenCalled();
  });

  it("forwards arbitrary button attributes such as aria-label", () => {
    render(<Button aria-label="Send message">Submit</Button>);
    expect(screen.getByRole("button")).toHaveAttribute(
      "aria-label",
      "Send message",
    );
  });

  /* Polymorphic & Link Coverage Tests */

  it("renders as an internal anchor link when component is 'a'", () => {
    render(
      <Button component="a" href="/dashboard">
        Go to Dashboard
      </Button>,
    );
    const link = screen.getByRole("link", { name: "Go to Dashboard" });
    expect(link).toBeInTheDocument();
    expect(link).toHaveAttribute("href", "/dashboard");
    expect(link).toHaveAttribute("target", "_self");
    expect(link).not.toHaveAttribute("rel");
  });

  it("renders as an external anchor link with safety defaults for absolute URLs", () => {
    render(
      <Button component="a" href="https://example.com">
        Visit External
      </Button>,
    );
    const link = screen.getByRole("link", { name: "Visit External" });
    expect(link).toHaveAttribute("href", "https://example.com");
    expect(link).toHaveAttribute("target", "_blank");
    expect(link).toHaveAttribute("rel", "noreferrer");
  });

  it("renders as an external link with custom target and rel values when provided", () => {
    render(
      <Button component="a" href="https://example.com" target="_parent" rel="noopener">
        Custom Link
      </Button>,
    );
    const link = screen.getByRole("link", { name: "Custom Link" });
    expect(link).toHaveAttribute("target", "_parent");
    expect(link).toHaveAttribute("rel", "noopener");
  });

  it("identifies mailto and tel links as external links", () => {
    render(
      <Button component="a" href="mailto:test@example.com">
        Email Us
      </Button>,
    );
    const link = screen.getByRole("link", { name: "Email Us" });
    expect(link).toHaveAttribute("target", "_blank");
    expect(link).toHaveAttribute("rel", "noreferrer");
  });
});
