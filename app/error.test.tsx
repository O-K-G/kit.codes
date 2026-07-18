import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import ErrorComponent from "./error";
import { BUTTON_LABEL, LABEL } from "./error.constants";

describe("Error", () => {
  it("renders the error message", () => {
    render(
      <ErrorComponent error={new Error("boom")} unstable_retry={jest.fn()} />,
    );
    expect(screen.getByText(LABEL)).toBeInTheDocument();
  });

  it("renders a retry button with the expected label", () => {
    render(
      <ErrorComponent error={new Error("boom")} unstable_retry={jest.fn()} />,
    );
    expect(
      screen.getByRole("button", { name: BUTTON_LABEL }),
    ).toBeInTheDocument();
  });

  it("calls unstable_retry when the retry button is clicked", async () => {
    const user = userEvent.setup();
    const unstable_retry = jest.fn();
    render(
      <ErrorComponent error={new Error("boom")} unstable_retry={unstable_retry} />,
    );

    await user.click(screen.getByRole("button", { name: BUTTON_LABEL }));
    expect(unstable_retry).toHaveBeenCalledTimes(1);
  });

  it("logs the received error to the console", () => {
    const consoleErrorSpy = jest
      .spyOn(console, "error")
      .mockImplementation(() => {});
    const error = new Error("boom");

    render(<ErrorComponent error={error} unstable_retry={jest.fn()} />);

    expect(consoleErrorSpy).toHaveBeenCalledWith(error);
    consoleErrorSpy.mockRestore();
  });

  it("re-logs when a new error is received", () => {
    const consoleErrorSpy = jest
      .spyOn(console, "error")
      .mockImplementation(() => {});
    const firstError = new Error("first");
    const secondError = new Error("second");

    const { rerender } = render(
      <ErrorComponent error={firstError} unstable_retry={jest.fn()} />,
    );
    rerender(
      <ErrorComponent error={secondError} unstable_retry={jest.fn()} />,
    );

    expect(consoleErrorSpy).toHaveBeenCalledWith(firstError);
    expect(consoleErrorSpy).toHaveBeenCalledWith(secondError);
    consoleErrorSpy.mockRestore();
  });
});
