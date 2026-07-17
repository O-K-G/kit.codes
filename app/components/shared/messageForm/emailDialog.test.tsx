import { render, screen } from "@testing-library/react";
import EmailDialog from "./emailDialog";
import { DIALOG_ARIA_LABEL } from "./emailDialog.constants";

jest.mock("@utils/sendEmail", () => ({
  sendEmail: jest.fn(),
}));

jest.mock("@ui/dialog/dialog", () => {
  const MockDialog = ({
    open,
    "aria-label": ariaLabel,
    children,
  }: {
    open: boolean;
    "aria-label": string;
    onClose: () => void;
    children: React.ReactNode;
  }) => {
    if (!open) {
      return null;
    }
    return (
      <div role="dialog" aria-label={ariaLabel}>
        {children}
      </div>
    );
  };
  return { __esModule: true, default: MockDialog };
});

describe("EmailDialog", () => {
  it("does not render dialog content when closed", () => {
    render(<EmailDialog open={false} onClose={jest.fn()} />);
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
  });

  it("renders dialog content when open", () => {
    render(<EmailDialog open onClose={jest.fn()} />);
    expect(screen.getByRole("dialog")).toBeInTheDocument();
  });

  it("passes the correct aria-label to the Dialog", () => {
    render(<EmailDialog open onClose={jest.fn()} />);
    expect(
      screen.getByRole("dialog", { name: DIALOG_ARIA_LABEL }),
    ).toBeInTheDocument();
  });

  it("renders the MessageForm's title inside the dialog when open", () => {
    render(<EmailDialog open onClose={jest.fn()} />);
    expect(screen.getByText("Send me an email")).toBeInTheDocument();
  });

  it("renders a form element inside the dialog", () => {
    const { container } = render(<EmailDialog open onClose={jest.fn()} />);
    expect(container.querySelector("form")).toBeInTheDocument();
  });

  it("renders the email input field", () => {
    render(<EmailDialog open onClose={jest.fn()} />);
    expect(screen.getByLabelText("From:")).toBeInTheDocument();
  });

  it("renders the subject input field", () => {
    render(<EmailDialog open onClose={jest.fn()} />);
    expect(screen.getByLabelText("Subject:")).toBeInTheDocument();
  });

  it("renders the message textarea field", () => {
    render(<EmailDialog open onClose={jest.fn()} />);
    expect(screen.getByLabelText("Message:")).toBeInTheDocument();
  });

  it("renders a close button", () => {
    render(<EmailDialog open onClose={jest.fn()} />);
    expect(screen.getByRole("button", { name: "Close" })).toBeInTheDocument();
  });

  it("does not throw when re-rendered from closed to open", () => {
    const { rerender } = render(<EmailDialog open={false} onClose={jest.fn()} />);
    expect(() =>
      rerender(<EmailDialog open onClose={jest.fn()} />),
    ).not.toThrow();
  });
});
