import { render, screen } from "@testing-library/react";
import Loading from "./loading";
import { LABEL } from "./loading.constants";
import styles from "./loading.module.css";

describe("Loading", () => {
  it("renders the loading label", () => {
    render(<Loading />);
    expect(screen.getByText(LABEL)).toBeInTheDocument();
  });

  it("renders the label as an h2 heading", () => {
    render(<Loading />);
    expect(screen.getByRole("heading", { level: 2, name: LABEL })).toBeInTheDocument();
  });

  it("applies the loading fade-in style to the wrapping element", () => {
    const { container } = render(<Loading />);
    expect(container.firstElementChild?.className).toContain(
      styles.loading,
    );
  });

  it("renders no interactive elements", () => {
    render(<Loading />);
    expect(screen.queryByRole("button")).not.toBeInTheDocument();
  });
});
