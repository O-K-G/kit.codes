import { render, screen } from "@testing-library/react";
import List from "./list";

describe("List", () => {
  it("renders a ul element when data has items", () => {
    const { container } = render(<List data={["one", "two"]} />);
    expect(container.querySelector("ul")).toBeInTheDocument();
  });

  it("renders one li per data item", () => {
    render(<List data={["one", "two", "three"]} />);
    expect(screen.getAllByRole("listitem")).toHaveLength(3);
  });

  it("renders the text of each item", () => {
    render(<List data={["apple", "banana"]} />);
    expect(screen.getByText("apple", { exact: false })).toBeInTheDocument();
    expect(screen.getByText("banana", { exact: false })).toBeInTheDocument();
  });

  it("renders a bullet character before each item", () => {
    const { container } = render(<List data={["one"]} />);
    expect(container.textContent).toContain("◦");
  });

  it("returns nothing (renders no ul) when data is undefined", () => {
    const { container } = render(<List />);
    expect(container.querySelector("ul")).not.toBeInTheDocument();
  });

  it("returns nothing (renders no ul) when data is an empty array", () => {
    const { container } = render(<List data={[]} />);
    expect(container.querySelector("ul")).not.toBeInTheDocument();
  });

  it("renders nothing visible in the container when data is empty", () => {
    const { container } = render(<List data={[]} />);
    expect(container).toBeEmptyDOMElement();
  });

  it("merges a custom className with the base style", () => {
    const { container } = render(
      <List data={["one"]} className="custom-class" />,
    );
    expect(container.querySelector("ul")?.className).toContain(
      "custom-class",
    );
  });

  it("preserves the order of items", () => {
    render(<List data={["first", "second", "third"]} />);
    const items = screen.getAllByRole("listitem");
    expect(items[0]).toHaveTextContent("first");
    expect(items[1]).toHaveTextContent("second");
    expect(items[2]).toHaveTextContent("third");
  });

  it("renders a single item list correctly", () => {
    render(<List data={["only"]} />);
    expect(screen.getAllByRole("listitem")).toHaveLength(1);
  });

  it("forwards arbitrary props such as id to the ul", () => {
    const { container } = render(<List data={["one"]} id="my-list" />);
    expect(container.querySelector("ul")).toHaveAttribute("id", "my-list");
  });
});
