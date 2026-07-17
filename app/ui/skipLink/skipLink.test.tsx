import { render, screen } from "@testing-library/react";
import SkipLink from "./skipLink";
import { LABEL, MAIN_CONTENT_ID } from "./skipLink.constants";

describe("SkipLink", () => {
  it("renders a link", () => {
    render(<SkipLink />);
    expect(screen.getByRole("link")).toBeInTheDocument();
  });

  it("renders the configured label text", () => {
    render(<SkipLink />);
    expect(screen.getByText(LABEL)).toBeInTheDocument();
  });

  it("links to the main content id anchor", () => {
    render(<SkipLink />);
    expect(screen.getByRole("link")).toHaveAttribute(
      "href",
      `#${MAIN_CONTENT_ID}`,
    );
  });

  it("sets target to _self", () => {
    render(<SkipLink />);
    expect(screen.getByRole("link")).toHaveAttribute("target", "_self");
  });

  it("uses the default rel from AnchorTag", () => {
    render(<SkipLink />);
    expect(screen.getByRole("link")).toHaveAttribute("rel", "noreferrer");
  });

  it("merges a custom className with the base style", () => {
    render(<SkipLink className="custom-class" />);
    expect(screen.getByRole("link").className).toContain("custom-class");
  });

  it("renders without a custom className without crashing", () => {
    render(<SkipLink />);
    expect(screen.getByRole("link")).toBeInTheDocument();
  });

  it("forwards arbitrary props such as id", () => {
    render(<SkipLink id="skip-to-content" />);
    expect(screen.getByRole("link")).toHaveAttribute("id", "skip-to-content");
  });

  it("renders the label as the accessible name", () => {
    render(<SkipLink />);
    expect(screen.getByRole("link", { name: LABEL })).toBeInTheDocument();
  });

  it("has an anchorTag base class applied", () => {
    render(<SkipLink />);
    expect(screen.getByRole("link").className).toContain("anchorTag");
  });
});
