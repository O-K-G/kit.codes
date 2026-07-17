import { render, screen } from "@testing-library/react";
import ProgressBar from "./progressBar";

describe("ProgressBar", () => {
  it("renders as an <li> by default", () => {
    const { container } = render(
      <ProgressBar id="react" startLabel="React" value="80" endLabel="Advanced" />,
    );
    expect(container.querySelector("li")).toBeInTheDocument();
  });

  it("renders as a <div> when component='div'", () => {
    const { container } = render(
      <ProgressBar
        id="react"
        startLabel="React"
        value="80"
        endLabel="Advanced"
        component="div"
      />,
    );
    expect(container.querySelector("div > progress")).toBeInTheDocument();
  });

  it("renders as a <span> when component='span'", () => {
    const { container } = render(
      <ProgressBar
        id="react"
        startLabel="React"
        value="80"
        endLabel="Advanced"
        component="span"
      />,
    );
    expect(container.querySelector("span > progress")).toBeInTheDocument();
  });

  it("renders the startLabel text", () => {
    render(<ProgressBar id="react" startLabel="React" value="80" endLabel="Advanced" />);
    expect(screen.getByText("React")).toBeInTheDocument();
  });

  it("renders the endLabel text", () => {
    render(<ProgressBar id="react" startLabel="React" value="80" endLabel="Advanced" />);
    expect(screen.getByText("Advanced")).toBeInTheDocument();
  });

  it("renders a <progress> element with the given id", () => {
    render(<ProgressBar id="react" startLabel="React" value="80" endLabel="Advanced" />);
    expect(document.getElementById("react")?.tagName).toBe("PROGRESS");
  });

  it("sets the progress value from the value prop", () => {
    render(<ProgressBar id="react" startLabel="React" value="80" endLabel="Advanced" />);
    expect(document.getElementById("react")).toHaveAttribute("value", "80");
  });

  it("sets max to 100", () => {
    render(<ProgressBar id="react" startLabel="React" value="80" endLabel="Advanced" />);
    expect(document.getElementById("react")).toHaveAttribute("max", "100");
  });

  it("associates the start label with the progress element via htmlFor/id", () => {
    render(<ProgressBar id="react" startLabel="React" value="80" endLabel="Advanced" />);
    expect(screen.getByText("React")).toHaveAttribute("for", "react");
  });

  it("applies a custom className alongside the default styles", () => {
    const { container } = render(
      <ProgressBar
        id="react"
        startLabel="React"
        value="80"
        endLabel="Advanced"
        className="custom-class"
      />,
    );
    expect(container.firstChild).toHaveClass("custom-class");
  });

  it("passes through additional rest props to the root component", () => {
    const { container } = render(
      <ProgressBar
        id="react"
        startLabel="React"
        value="80"
        endLabel="Advanced"
        data-testid="progress-root"
      />,
    );
    expect(container.querySelector('[data-testid="progress-root"]')).toBeInTheDocument();
  });

  it("renders the value as fallback text content inside <progress>", () => {
    render(<ProgressBar id="react" startLabel="React" value="80" endLabel="Advanced" />);
    expect(document.getElementById("react")).toHaveTextContent("80");
  });
});
