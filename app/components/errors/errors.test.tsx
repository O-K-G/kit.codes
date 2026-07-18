import { render, screen } from "@testing-library/react";
import Errors from "./errors";

describe("Errors", () => {
  it("renders the label text", () => {
    render(<Errors label="Something went wrong!" />);
    expect(screen.getByText("Something went wrong!")).toBeInTheDocument();
  });

  it("renders the label as an h2", () => {
    render(<Errors label="Something went wrong!" />);
    expect(
      screen.getByRole("heading", { level: 2, name: "Something went wrong!" }),
    ).toBeInTheDocument();
  });

  it("renders ReactNode labels", () => {
    render(
      <Errors
        label={
          <>
            <span>Oops!</span>
            &nbsp;Try again.
          </>
        }
      />,
    );
    expect(screen.getByText("Oops!")).toBeInTheDocument();
  });

  it("renders children alongside the label", () => {
    render(
      <Errors label="Something went wrong!">
        <button>Retry</button>
      </Errors>,
    );
    expect(screen.getByRole("button", { name: "Retry" })).toBeInTheDocument();
  });

  it("renders no children when none are given", () => {
    const { container } = render(<Errors label="Something went wrong!" />);
    expect(container.querySelector("h2")?.nextSibling).toBeNull();
  });

  it("merges a custom className with the base style", () => {
    const { container } = render(
      <Errors label="Something went wrong!" className="custom-class" />,
    );
    expect(container.firstElementChild?.className).toContain("custom-class");
  });

  it("forwards arbitrary attributes to the wrapping div", () => {
    render(<Errors label="Something went wrong!" data-testid="errors-root" />);
    expect(screen.getByTestId("errors-root")).toBeInTheDocument();
  });
});
