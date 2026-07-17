import { render } from "@testing-library/react";
import RadioTowerIcon from "./radioTowerIcon";

describe("RadioTowerIcon", () => {
  it("renders an svg element", () => {
    const { container } = render(<RadioTowerIcon />);
    expect(container.querySelector("svg")).toBeInTheDocument();
  });

  it("sets the xmlns attribute", () => {
    const { container } = render(<RadioTowerIcon />);
    expect(container.querySelector("svg")).toHaveAttribute(
      "xmlns",
      "http://w3.org",
    );
  });

  it("sets the expected viewBox", () => {
    const { container } = render(<RadioTowerIcon />);
    expect(container.querySelector("svg")).toHaveAttribute(
      "viewBox",
      "0 -960 960 960",
    );
  });

  it("defaults to the icon module class when no className is passed", () => {
    const { container } = render(<RadioTowerIcon />);
    expect(container.querySelector("svg")).toHaveClass("icon");
  });

  it("renders exactly three paths", () => {
    const { container } = render(<RadioTowerIcon />);
    expect(container.querySelectorAll("path")).toHaveLength(3);
  });

  it("gives the outer bars path the outerBars module class", () => {
    const { container } = render(<RadioTowerIcon />);
    expect(container.querySelectorAll("path")[0]).toHaveClass("outerBars");
  });

  it("gives the inner bars path the innerBars module class", () => {
    const { container } = render(<RadioTowerIcon />);
    expect(container.querySelectorAll("path")[1]).toHaveClass("innerBars");
  });

  it("gives the tower path the tower module class", () => {
    const { container } = render(<RadioTowerIcon />);
    expect(container.querySelectorAll("path")[2]).toHaveClass("tower");
  });

  it("has fill currentFill on every path", () => {
    const { container } = render(<RadioTowerIcon />);
    container.querySelectorAll("path").forEach((path) => {
      expect(path).toHaveAttribute("fill", "currentFill");
    });
  });

  it("overrides the default className when one is passed via props", () => {
    const { container } = render(<RadioTowerIcon className="custom-icon" />);
    const svg = container.querySelector("svg");
    expect(svg).toHaveClass("custom-icon");
    expect(svg).not.toHaveClass("icon");
  });

  it("forwards width and height", () => {
    const { container } = render(<RadioTowerIcon width={32} height={32} />);
    const svg = container.querySelector("svg");
    expect(svg).toHaveAttribute("width", "32");
    expect(svg).toHaveAttribute("height", "32");
  });

  it("forwards data-testid for querying", () => {
    const { getByTestId } = render(
      <RadioTowerIcon data-testid="radio-tower" />,
    );
    expect(getByTestId("radio-tower")).toBeInTheDocument();
  });
});
