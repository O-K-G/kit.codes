import { render } from "@testing-library/react";
import CloseIcon from "./closeIcon";

describe("CloseIcon", () => {
  it("renders an svg element", () => {
    const { container } = render(<CloseIcon />);
    expect(container.querySelector("svg")).toBeInTheDocument();
  });

  it("sets the xmlns namespace", () => {
    const { container } = render(<CloseIcon />);
    expect(container.querySelector("svg")).toHaveAttribute(
      "xmlns",
      "http://www.w3.org/2000/svg",
    );
  });

  it("sets the expected viewBox", () => {
    const { container } = render(<CloseIcon />);
    expect(container.querySelector("svg")).toHaveAttribute(
      "viewBox",
      "0 -960 960 960",
    );
  });

  it("defaults fill to currentFill", () => {
    const { container } = render(<CloseIcon />);
    expect(container.querySelector("svg")).toHaveAttribute(
      "fill",
      "currentFill",
    );
  });

  it("renders exactly one path", () => {
    const { container } = render(<CloseIcon />);
    expect(container.querySelectorAll("path")).toHaveLength(1);
  });

  it("forwards a custom className", () => {
    const { container } = render(<CloseIcon className="my-icon" />);
    expect(container.querySelector("svg")).toHaveClass("my-icon");
  });

  it("forwards width and height", () => {
    const { container } = render(<CloseIcon width={16} height={16} />);
    const svg = container.querySelector("svg");
    expect(svg).toHaveAttribute("width", "16");
    expect(svg).toHaveAttribute("height", "16");
  });

  it("allows overriding fill via props", () => {
    const { container } = render(<CloseIcon fill="green" />);
    expect(container.querySelector("svg")).toHaveAttribute("fill", "green");
  });

  it("forwards aria-label for accessibility", () => {
    const { container } = render(<CloseIcon aria-label="Close" />);
    expect(container.querySelector("svg")).toHaveAttribute(
      "aria-label",
      "Close",
    );
  });

  it("forwards an onClick handler", () => {
    const onClick = jest.fn();
    const { container } = render(<CloseIcon onClick={onClick} />);
    container.querySelector("svg")?.dispatchEvent(
      new MouseEvent("click", { bubbles: true }),
    );
    expect(onClick).toHaveBeenCalledTimes(1);
  });

  it("forwards data-testid for querying", () => {
    const { getByTestId } = render(<CloseIcon data-testid="close-icon" />);
    expect(getByTestId("close-icon")).toBeInTheDocument();
  });
});
