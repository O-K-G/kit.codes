import { render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";
import Tooltip from "@ui/tooltip/Tooltip";

describe("Tooltip", () => {
  test("describes its element, placed and aligned as asked", () => {
    render(
      <Tooltip tabIndex={0} aria-label="Trigger" content="Some text" placement="bottom" align="end">
        +
      </Tooltip>
    );

    const trigger = screen.getByLabelText("Trigger");
    expect(trigger).toHaveAccessibleDescription("Some text");
    expect(screen.getByRole("tooltip", { hidden: true })).toHaveAttribute("data-placement", "bottom");
    expect(screen.getByRole("tooltip", { hidden: true })).toHaveAttribute("data-align", "end");
    expect(trigger).not.toHaveAttribute("data-open");
  });

  test("given `open`, says whether it's open", () => {
    const { rerender } = render(<Tooltip data-testid="trigger" open content="20%" />);
    expect(screen.getByTestId("trigger")).toHaveAttribute("data-open", "true");

    rerender(<Tooltip data-testid="trigger" open={false} content="20%" />);
    expect(screen.getByTestId("trigger")).toHaveAttribute("data-open", "false");
  });

  test("Escape closes it while it's shown, until the focus leaves", () => {
    render(<Tooltip tabIndex={0} aria-label="Trigger" content="Some text" />);
    const trigger = screen.getByLabelText("Trigger");

    // Not shown (neither hovered nor focused): Escape leaves it be
    fireEvent.keyDown(window, { key: "Escape" });
    expect(trigger).not.toHaveAttribute("data-dismissed");

    trigger.focus();
    fireEvent.keyDown(window, { key: "Escape" });
    expect(trigger).toHaveAttribute("data-dismissed");

    fireEvent.blur(trigger);
    expect(trigger).not.toHaveAttribute("data-dismissed");
  });

  test("given `open`, Escape closes it until it closes and opens again", () => {
    const { rerender } = render(<Tooltip data-testid="trigger" open content="20%" />);
    const trigger = screen.getByTestId("trigger");

    fireEvent.keyDown(window, { key: "Escape" });
    expect(trigger).toHaveAttribute("data-dismissed");

    rerender(<Tooltip data-testid="trigger" open={false} content="20%" />);
    rerender(<Tooltip data-testid="trigger" open content="20%" />);
    expect(trigger).not.toHaveAttribute("data-dismissed");
  });
});
