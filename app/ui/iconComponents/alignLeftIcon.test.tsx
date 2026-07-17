import { render } from "@testing-library/react";
import AlignLeftIcon from "./alignLeftIcon";

describe("AlignLeftIcon", () => {
  it("renders an svg element", () => {
    const { container } = render(<AlignLeftIcon />);
    expect(container.querySelector("svg")).toBeInTheDocument();
  });

  it("sets the xmlns namespace", () => {
    const { container } = render(<AlignLeftIcon />);
    expect(container.querySelector("svg")).toHaveAttribute(
      "xmlns",
      "http://www.w3.org/2000/svg",
    );
  });

  it("sets the expected viewBox", () => {
    const { container } = render(<AlignLeftIcon />);
    expect(container.querySelector("svg")).toHaveAttribute(
      "viewBox",
      "0 -960 960 960",
    );
  });

  it("defaults fill to currentFill", () => {
    const { container } = render(<AlignLeftIcon />);
    expect(container.querySelector("svg")).toHaveAttribute(
      "fill",
      "currentFill",
    );
  });

  it("renders exactly one path", () => {
    const { container } = render(<AlignLeftIcon />);
    expect(container.querySelectorAll("path")).toHaveLength(1);
  });

  it("forwards a custom className", () => {
    const { container } = render(<AlignLeftIcon className="my-icon" />);
    expect(container.querySelector("svg")).toHaveClass("my-icon");
  });

  it("forwards width and height", () => {
    const { container } = render(<AlignLeftIcon width={24} height={24} />);
    const svg = container.querySelector("svg");
    expect(svg).toHaveAttribute("width", "24");
    expect(svg).toHaveAttribute("height", "24");
  });

  it("allows overriding fill via props", () => {
    const { container } = render(<AlignLeftIcon fill="red" />);
    expect(container.querySelector("svg")).toHaveAttribute("fill", "red");
  });

  it("forwards aria-hidden", () => {
    const { container } = render(<AlignLeftIcon aria-hidden="true" />);
    expect(container.querySelector("svg")).toHaveAttribute(
      "aria-hidden",
      "true",
    );
  });

  it("forwards an onClick handler", () => {
    const onClick = jest.fn();
    const { container } = render(<AlignLeftIcon onClick={onClick} />);
    container.querySelector("svg")?.dispatchEvent(
      new MouseEvent("click", { bubbles: true }),
    );
    expect(onClick).toHaveBeenCalledTimes(1);
  });

  it("forwards data-testid for querying", () => {
    const { getByTestId } = render(<AlignLeftIcon data-testid="align-left" />);
    expect(getByTestId("align-left")).toBeInTheDocument();
  });
});
