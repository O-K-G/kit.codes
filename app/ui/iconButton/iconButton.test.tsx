import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import IconButton from "./iconButton";

describe("IconButton", () => {
  it("renders its children", () => {
    render(<IconButton aria-label="Close">X</IconButton>);
    expect(screen.getByText("X")).toBeInTheDocument();
  });

  it("renders as a button element", () => {
    render(<IconButton aria-label="Close">X</IconButton>);
    expect(screen.getByRole("button")).toBeInTheDocument();
  });

  it("sets the aria-label prop", () => {
    render(<IconButton aria-label="Close">X</IconButton>);
    expect(screen.getByRole("button", { name: "Close" })).toBeInTheDocument();
  });

  it("defaults type to button", () => {
    render(<IconButton aria-label="Close">X</IconButton>);
    expect(screen.getByRole("button")).toHaveAttribute("type", "button");
  });

  it("allows overriding type to submit", () => {
    render(
      <IconButton aria-label="Close" type="submit">
        X
      </IconButton>,
    );
    expect(screen.getByRole("button")).toHaveAttribute("type", "submit");
  });

  it("defaults variant to outline-paper", () => {
    render(<IconButton aria-label="Close">X</IconButton>);
    expect(screen.getByRole("button")).toHaveAttribute(
      "data-variant",
      "outline-paper",
    );
  });

  it("applies the fill-sky-deep variant", () => {
    render(
      <IconButton aria-label="Close" variant="fill-sky-deep">
        X
      </IconButton>,
    );
    expect(screen.getByRole("button")).toHaveAttribute(
      "data-variant",
      "fill-sky-deep",
    );
  });

  it("defaults data-circle to undefined when circle is not provided", () => {
    render(<IconButton aria-label="Close">X</IconButton>);
    expect(screen.getByRole("button")).not.toHaveAttribute("data-circle");
  });

  it("sets data-circle to true when circle is provided", () => {
    render(
      <IconButton aria-label="Close" circle>
        X
      </IconButton>,
    );
    expect(screen.getByRole("button")).toHaveAttribute("data-circle", "true");
  });

  it("defaults data-group-fill and data-group-stroke to false", () => {
    render(<IconButton aria-label="Close">X</IconButton>);
    const button = screen.getByRole("button");
    expect(button).toHaveAttribute("data-group-fill", "false");
    expect(button).toHaveAttribute("data-group-stroke", "false");
  });

  it("sets data-group-fill to true when groupFill is provided", () => {
    render(
      <IconButton aria-label="Close" groupFill>
        X
      </IconButton>,
    );
    expect(screen.getByRole("button")).toHaveAttribute(
      "data-group-fill",
      "true",
    );
  });

  it("sets data-group-stroke to true when groupStroke is provided", () => {
    render(
      <IconButton aria-label="Close" groupStroke>
        X
      </IconButton>,
    );
    expect(screen.getByRole("button")).toHaveAttribute(
      "data-group-stroke",
      "true",
    );
  });

  it("merges a custom className with the base style", () => {
    render(
      <IconButton aria-label="Close" className="custom-class">
        X
      </IconButton>,
    );
    expect(screen.getByRole("button").className).toContain("custom-class");
  });

  it("calls onClick when clicked", async () => {
    const onClick = jest.fn();
    render(
      <IconButton aria-label="Close" onClick={onClick}>
        X
      </IconButton>,
    );
    await userEvent.click(screen.getByRole("button"));
    expect(onClick).toHaveBeenCalledTimes(1);
  });
});
