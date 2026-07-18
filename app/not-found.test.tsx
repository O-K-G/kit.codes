import { render, screen } from "@testing-library/react";
import NotFound from "./not-found";
import { LABEL } from "./not-found.constants";

describe("NotFound", () => {
  it("renders the 404 message", () => {
    render(<NotFound />);
    expect(
      screen.getByText(/Lost & Found room/, { exact: false }),
    ).toBeInTheDocument();
  });

  it("renders the label as an h2 heading", () => {
    render(<NotFound />);
    expect(screen.getByRole("heading", { level: 2 })).toBeInTheDocument();
  });

  it("renders the exact copy from LABEL", () => {
    const { container } = render(<NotFound />);
    const { container: expected } = render(<>{LABEL}</>);
    expect(container.querySelector("h2")?.textContent).toBe(
      expected.textContent,
    );
  });

  it("mentions the Lost & Found room and the 404 code together", () => {
    render(<NotFound />);
    expect(screen.getByRole("heading", { level: 2 }).textContent).toContain(
      "(404)",
    );
  });

  it("does not render any interactive elements", () => {
    render(<NotFound />);
    expect(screen.queryByRole("button")).not.toBeInTheDocument();
  });
});
