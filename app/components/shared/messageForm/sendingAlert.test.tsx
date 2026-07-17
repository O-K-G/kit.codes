import { render, screen } from "@testing-library/react";
import SendingAlert from "./sendingAlert";

describe("SendingAlert", () => {
  it("renders the sending label text", () => {
    render(<SendingAlert />);
    expect(screen.getByText(/Sending.../)).toBeInTheDocument();
  });

  it("renders a radio tower icon (svg)", () => {
    const { container } = render(<SendingAlert />);
    expect(container.querySelector("svg")).toBeInTheDocument();
  });

  it("marks the icon as aria-hidden", () => {
    const { container } = render(<SendingAlert />);
    expect(container.querySelector("svg")).toHaveAttribute(
      "aria-hidden",
      "true",
    );
  });

  it("renders inside a span wrapper", () => {
    const { container } = render(<SendingAlert />);
    expect(container.querySelector("span")).toBeInTheDocument();
  });

  it("renders exactly one span at the top level", () => {
    const { container } = render(<SendingAlert />);
    expect(container.children).toHaveLength(1);
    expect(container.firstElementChild?.tagName).toBe("SPAN");
  });

  it("renders exactly one svg icon", () => {
    const { container } = render(<SendingAlert />);
    expect(container.querySelectorAll("svg")).toHaveLength(1);
  });

  it("does not throw when rendered", () => {
    expect(() => render(<SendingAlert />)).not.toThrow();
  });

  it("does not throw when unmounted", () => {
    const { unmount } = render(<SendingAlert />);
    expect(() => unmount()).not.toThrow();
  });

  it("renders consistently across multiple mounts", () => {
    const { container: c1 } = render(<SendingAlert />);
    const { container: c2 } = render(<SendingAlert />);
    expect(c1.textContent).toBe(c2.textContent);
  });

  it("contains the icon before the text node", () => {
    const { container } = render(<SendingAlert />);
    const span = container.querySelector("span");
    const svg = span?.querySelector("svg");
    expect(svg).toBeTruthy();
    expect(span?.textContent?.trim().endsWith("Sending...")).toBe(true);
  });
});
