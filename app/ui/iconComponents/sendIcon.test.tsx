import { render } from "@testing-library/react";
import SendIcon from "./sendIcon";

describe("SendIcon", () => {
  it("renders an svg element", () => {
    const { container } = render(<SendIcon />);
    expect(container.querySelector("svg")).toBeInTheDocument();
  });

  it("sets the xmlns namespace", () => {
    const { container } = render(<SendIcon />);
    expect(container.querySelector("svg")).toHaveAttribute(
      "xmlns",
      "http://www.w3.org/2000/svg",
    );
  });

  it("sets the expected viewBox", () => {
    const { container } = render(<SendIcon />);
    expect(container.querySelector("svg")).toHaveAttribute(
      "viewBox",
      "0 -960 960 960",
    );
  });

  it("defaults fill to currentFill", () => {
    const { container } = render(<SendIcon />);
    expect(container.querySelector("svg")).toHaveAttribute(
      "fill",
      "currentFill",
    );
  });

  it("renders exactly one path", () => {
    const { container } = render(<SendIcon />);
    expect(container.querySelectorAll("path")).toHaveLength(1);
  });

  it("forwards a custom className", () => {
    const { container } = render(<SendIcon className="my-icon" />);
    expect(container.querySelector("svg")).toHaveClass("my-icon");
  });

  it("forwards width and height", () => {
    const { container } = render(<SendIcon width={20} height={20} />);
    const svg = container.querySelector("svg");
    expect(svg).toHaveAttribute("width", "20");
    expect(svg).toHaveAttribute("height", "20");
  });

  it("allows overriding fill via props", () => {
    const { container } = render(<SendIcon fill="orange" />);
    expect(container.querySelector("svg")).toHaveAttribute("fill", "orange");
  });

  it("forwards role for accessibility", () => {
    const { container } = render(<SendIcon role="img" />);
    expect(container.querySelector("svg")).toHaveAttribute("role", "img");
  });

  it("forwards an onClick handler", () => {
    const onClick = jest.fn();
    const { container } = render(<SendIcon onClick={onClick} />);
    container.querySelector("svg")?.dispatchEvent(
      new MouseEvent("click", { bubbles: true }),
    );
    expect(onClick).toHaveBeenCalledTimes(1);
  });

  it("forwards data-testid for querying", () => {
    const { getByTestId } = render(<SendIcon data-testid="send-icon" />);
    expect(getByTestId("send-icon")).toBeInTheDocument();
  });
});
