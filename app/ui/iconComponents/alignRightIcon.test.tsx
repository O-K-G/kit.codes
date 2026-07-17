import { render } from "@testing-library/react";
import AlignRightIcon from "./alignRightIcon";

describe("AlignRightIcon", () => {
  it("renders an svg element", () => {
    const { container } = render(<AlignRightIcon />);
    expect(container.querySelector("svg")).toBeInTheDocument();
  });

  it("sets the xmlns namespace", () => {
    const { container } = render(<AlignRightIcon />);
    expect(container.querySelector("svg")).toHaveAttribute(
      "xmlns",
      "http://www.w3.org/2000/svg",
    );
  });

  it("sets the expected viewBox", () => {
    const { container } = render(<AlignRightIcon />);
    expect(container.querySelector("svg")).toHaveAttribute(
      "viewBox",
      "0 -960 960 960",
    );
  });

  it("defaults fill to currentFill", () => {
    const { container } = render(<AlignRightIcon />);
    expect(container.querySelector("svg")).toHaveAttribute(
      "fill",
      "currentFill",
    );
  });

  it("renders exactly one path", () => {
    const { container } = render(<AlignRightIcon />);
    expect(container.querySelectorAll("path")).toHaveLength(1);
  });

  it("forwards a custom className", () => {
    const { container } = render(<AlignRightIcon className="my-icon" />);
    expect(container.querySelector("svg")).toHaveClass("my-icon");
  });

  it("forwards width and height", () => {
    const { container } = render(<AlignRightIcon width={24} height={24} />);
    const svg = container.querySelector("svg");
    expect(svg).toHaveAttribute("width", "24");
    expect(svg).toHaveAttribute("height", "24");
  });

  it("allows overriding fill via props", () => {
    const { container } = render(<AlignRightIcon fill="blue" />);
    expect(container.querySelector("svg")).toHaveAttribute("fill", "blue");
  });

  it("forwards aria-hidden", () => {
    const { container } = render(<AlignRightIcon aria-hidden="true" />);
    expect(container.querySelector("svg")).toHaveAttribute(
      "aria-hidden",
      "true",
    );
  });

  it("forwards an onClick handler", () => {
    const onClick = jest.fn();
    const { container } = render(<AlignRightIcon onClick={onClick} />);
    container.querySelector("svg")?.dispatchEvent(
      new MouseEvent("click", { bubbles: true }),
    );
    expect(onClick).toHaveBeenCalledTimes(1);
  });

  it("forwards data-testid for querying", () => {
    const { getByTestId } = render(
      <AlignRightIcon data-testid="align-right" />,
    );
    expect(getByTestId("align-right")).toBeInTheDocument();
  });
});
