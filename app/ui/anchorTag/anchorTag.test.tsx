import { render, screen } from "@testing-library/react";
import AnchorTag from "./anchorTag";

describe("AnchorTag", () => {
  it("renders an anchor element", () => {
    render(<AnchorTag href="https://example.com">Example</AnchorTag>);
    expect(screen.getByRole("link", { name: "Example" })).toBeInTheDocument();
  });

  it("renders the children text", () => {
    render(<AnchorTag href="https://example.com">Click here</AnchorTag>);
    expect(screen.getByText("Click here")).toBeInTheDocument();
  });

  it("defaults target to _blank", () => {
    render(<AnchorTag href="https://example.com">Example</AnchorTag>);
    expect(screen.getByRole("link")).toHaveAttribute("target", "_blank");
  });

  it("defaults rel to noreferrer", () => {
    render(<AnchorTag href="https://example.com">Example</AnchorTag>);
    expect(screen.getByRole("link")).toHaveAttribute("rel", "noreferrer");
  });

  it("allows overriding target", () => {
    render(
      <AnchorTag href="https://example.com" target="_self">
        Example
      </AnchorTag>,
    );
    expect(screen.getByRole("link")).toHaveAttribute("target", "_self");
  });

  it("allows overriding rel", () => {
    render(
      <AnchorTag href="https://example.com" rel="noopener">
        Example
      </AnchorTag>,
    );
    expect(screen.getByRole("link")).toHaveAttribute("rel", "noopener");
  });

  it("forwards the href prop", () => {
    render(<AnchorTag href="https://example.com/page">Example</AnchorTag>);
    expect(screen.getByRole("link")).toHaveAttribute(
      "href",
      "https://example.com/page",
    );
  });

  it("merges a custom className with the base style", () => {
    render(
      <AnchorTag href="https://example.com" className="custom-class">
        Example
      </AnchorTag>,
    );
    expect(screen.getByRole("link").className).toContain("custom-class");
  });

  it("renders without a custom className without crashing", () => {
    render(<AnchorTag href="https://example.com">Example</AnchorTag>);
    expect(screen.getByRole("link")).toBeInTheDocument();
  });

  it("forwards arbitrary anchor attributes such as id", () => {
    render(
      <AnchorTag href="https://example.com" id="my-link">
        Example
      </AnchorTag>,
    );
    expect(screen.getByRole("link")).toHaveAttribute("id", "my-link");
  });

  it("forwards data attributes", () => {
    render(
      <AnchorTag href="https://example.com" data-testid="anchor-tag">
        Example
      </AnchorTag>,
    );
    expect(screen.getByTestId("anchor-tag")).toBeInTheDocument();
  });
});
