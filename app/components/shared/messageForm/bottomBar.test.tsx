import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import BottomBar from "./bottomBar";

describe("BottomBar", () => {
  it("renders the align left button", () => {
    render(<BottomBar dir="ltr" onClick={jest.fn()} />);
    expect(
      screen.getByRole("button", { name: "Align left" }),
    ).toBeInTheDocument();
  });

  it("renders the align right button", () => {
    render(<BottomBar dir="ltr" onClick={jest.fn()} />);
    expect(
      screen.getByRole("button", { name: "Align right" }),
    ).toBeInTheDocument();
  });

  it("renders the send button as a submit type", () => {
    render(<BottomBar dir="ltr" onClick={jest.fn()} />);
    expect(screen.getByRole("button", { name: "Send" })).toHaveAttribute(
      "type",
      "submit",
    );
  });

  it("disables the align left button when dir is ltr", () => {
    render(<BottomBar dir="ltr" onClick={jest.fn()} />);
    expect(screen.getByRole("button", { name: "Align left" })).toBeDisabled();
  });

  it("disables the align right button when dir is rtl", () => {
    render(<BottomBar dir="rtl" onClick={jest.fn()} />);
    expect(screen.getByRole("button", { name: "Align right" })).toBeDisabled();
  });

  it("enables the align right button when dir is ltr", () => {
    render(<BottomBar dir="ltr" onClick={jest.fn()} />);
    expect(
      screen.getByRole("button", { name: "Align right" }),
    ).not.toBeDisabled();
  });

  it("calls onClick when the align left button is clicked (rtl mode)", async () => {
    const user = userEvent.setup();
    const onClick = jest.fn();
    render(<BottomBar dir="rtl" onClick={onClick} />);
    await user.click(screen.getByRole("button", { name: "Align left" }));
    expect(onClick).toHaveBeenCalledTimes(1);
  });

  it("calls onClick when the align right button is clicked (ltr mode)", async () => {
    const user = userEvent.setup();
    const onClick = jest.fn();
    render(<BottomBar dir="ltr" onClick={onClick} />);
    await user.click(screen.getByRole("button", { name: "Align right" }));
    expect(onClick).toHaveBeenCalledTimes(1);
  });

  it("does not render a status message by default", () => {
    render(<BottomBar dir="ltr" onClick={jest.fn()} />);
    const statusMessageRegion = document.querySelector(
      '[aria-live="polite"][aria-atomic="true"]',
    );
    expect(statusMessageRegion?.textContent).toBe("");
  });

  it("renders the status message when provided", () => {
    render(
      <BottomBar dir="ltr" onClick={jest.fn()} statusMessage="Sent!" />,
    );
    expect(screen.getByText("Sent!")).toBeInTheDocument();
  });

  it("marks the status message region as an aria-live polite, atomic region", () => {
    render(<BottomBar dir="ltr" onClick={jest.fn()} statusMessage="Sent!" />);
    const region = screen.getByText("Sent!").closest('[aria-live="polite"]');
    expect(region).toHaveAttribute("aria-atomic", "true");
  });

  it("applies the dir attribute to the direction buttons wrapper", () => {
    const { container } = render(<BottomBar dir="rtl" onClick={jest.fn()} />);
    expect(container.querySelector('div[dir="rtl"]')).toBeInTheDocument();
  });
});
