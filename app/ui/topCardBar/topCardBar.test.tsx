import { render, screen } from "@testing-library/react";
import TopCardBar from "./topCardBar";

describe("TopCardBar", () => {
  it("renders the leftSlot text", () => {
    render(
      <TopCardBar leftSlot="2024" rightSlot="Remote" leftSlotColor="paper" />,
    );
    expect(screen.getByText("2024")).toBeInTheDocument();
  });

  it("renders a string rightSlot wrapped in Typography with mist color", () => {
    render(
      <TopCardBar leftSlot="2024" rightSlot="Remote" leftSlotColor="paper" />,
    );
    expect(screen.getByText("Remote")).toHaveAttribute("data-color", "mist");
  });

  it("applies the leftSlotColor to the leftSlot Typography", () => {
    render(
      <TopCardBar leftSlot="2024" rightSlot="Remote" leftSlotColor="sky-deep" />,
    );
    expect(screen.getByText("2024")).toHaveAttribute("data-color", "sky-deep");
  });

  it("renders a non-string rightSlot node as-is, without wrapping Typography", () => {
    render(
      <TopCardBar
        leftSlot="2024"
        rightSlot={<button>Action</button>}
        leftSlotColor="paper"
      />,
    );
    expect(screen.getByRole("button", { name: "Action" })).toBeInTheDocument();
  });

  it("does not add data-color to a non-string rightSlot", () => {
    render(
      <TopCardBar
        leftSlot="2024"
        rightSlot={<span data-testid="custom-slot">Custom</span>}
        leftSlotColor="paper"
      />,
    );
    expect(screen.getByTestId("custom-slot")).not.toHaveAttribute(
      "data-color",
    );
  });

  it("uses the unit-plate variant for the leftSlot", () => {
    render(
      <TopCardBar leftSlot="2024" rightSlot="Remote" leftSlotColor="paper" />,
    );
    expect(screen.getByText("2024")).toHaveAttribute(
      "data-variant",
      "unit-plate",
    );
  });

  it("uses the unit-plate variant for a string rightSlot", () => {
    render(
      <TopCardBar leftSlot="2024" rightSlot="Remote" leftSlotColor="paper" />,
    );
    expect(screen.getByText("Remote")).toHaveAttribute(
      "data-variant",
      "unit-plate",
    );
  });

  it("merges a custom className with the base style", () => {
    const { container } = render(
      <TopCardBar
        leftSlot="2024"
        rightSlot="Remote"
        leftSlotColor="paper"
        className="custom-class"
      />,
    );
    expect(container.firstChild).toHaveClass("custom-class");
  });

  it("renders both leftSlot and rightSlot as span elements", () => {
    render(
      <TopCardBar leftSlot="2024" rightSlot="Remote" leftSlotColor="paper" />,
    );
    expect(screen.getByText("2024").tagName).toBe("SPAN");
    expect(screen.getByText("Remote").tagName).toBe("SPAN");
  });

  it("forwards arbitrary props such as id to the wrapping div", () => {
    const { container } = render(
      <TopCardBar
        leftSlot="2024"
        rightSlot="Remote"
        leftSlotColor="paper"
        id="top-bar"
      />,
    );
    expect(container.querySelector("#top-bar")).toBeInTheDocument();
  });
});
