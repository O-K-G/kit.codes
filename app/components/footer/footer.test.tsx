import { render, screen } from "@testing-library/react";
import Footer from "./footer";
import { LABEL } from "./footer.constants";

describe("Footer", () => {
  it("renders the footer label text", () => {
    render(<Footer />);
    expect(screen.getByText(LABEL)).toBeInTheDocument();
  });

  it("renders as a <footer> element", () => {
    const { container } = render(<Footer />);
    expect(container.querySelector("footer")).toBeInTheDocument();
  });

  it("renders exactly one footer element", () => {
    const { container } = render(<Footer />);
    expect(container.querySelectorAll("footer")).toHaveLength(1);
  });

  it("uses the 'footer' typography variant", () => {
    const { container } = render(<Footer />);
    expect(container.querySelector("footer")).toHaveAttribute(
      "data-variant",
      "footer",
    );
  });

  it("uses the 'mist' color", () => {
    const { container } = render(<Footer />);
    expect(container.querySelector("footer")).toHaveAttribute(
      "data-color",
      "mist",
    );
  });

  it("contains the word 'Thanks'", () => {
    render(<Footer />);
    expect(screen.getByText(/thanks/i)).toBeInTheDocument();
  });

  it("mentions the renovation year", () => {
    render(<Footer />);
    expect(screen.getByText(/renovated 2026/i)).toBeInTheDocument();
  });

  it("does not render any headings", () => {
    const { container } = render(<Footer />);
    expect(container.querySelectorAll("h1,h2,h3,h4,h5,h6")).toHaveLength(0);
  });

  it("applies the footerText class", () => {
    const { container } = render(<Footer />);
    expect(container.querySelector("footer")?.className).toEqual(
      expect.stringContaining("footerText"),
    );
  });

  it("renders without crashing on remount", () => {
    const { unmount } = render(<Footer />);
    unmount();
    expect(() => render(<Footer />)).not.toThrow();
  });
});
