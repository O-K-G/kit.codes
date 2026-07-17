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
});
