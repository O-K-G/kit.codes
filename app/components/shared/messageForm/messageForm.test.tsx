import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import MessageForm from "./messageForm";
import { sendEmail } from "@utils/sendEmail";
import { LABELS, TITLE } from "./messageForm.constants";

jest.mock("@utils/sendEmail", () => ({
  sendEmail: jest.fn(),
}));

const sendEmailMock = sendEmail as jest.Mock;

describe("MessageForm", () => {
  beforeEach(() => {
    sendEmailMock.mockReset();
  });

  it("renders the form title", () => {
    render(<MessageForm onClick={jest.fn()} />);
    expect(screen.getByText(TITLE)).toBeInTheDocument();
  });

  it("renders the email, subject and message fields", () => {
    render(<MessageForm onClick={jest.fn()} />);
    expect(screen.getByLabelText(LABELS.email)).toBeInTheDocument();
    expect(screen.getByLabelText(LABELS.subject)).toBeInTheDocument();
    expect(screen.getByLabelText(LABELS.message)).toBeInTheDocument();
  });

  it("renders a hidden honeypot track field", () => {
    const { container } = render(<MessageForm onClick={jest.fn()} />);
    const trackWrapper = container.querySelector(".track");
    const trackInput = container.querySelector('input[name="trackInput"]');
    expect(trackWrapper).toHaveAttribute("aria-hidden", "true");
    expect(trackInput).toHaveAttribute("tabindex", "-1");
  });

  it("shows the full character allowance for the email field initially", () => {
    render(<MessageForm onClick={jest.fn()} />);
    expect(screen.getByText("254 characters left")).toBeInTheDocument();
  });

  it("updates the character counter as the user types in the subject field", async () => {
    const user = userEvent.setup();
    render(<MessageForm onClick={jest.fn()} />);
    await user.type(screen.getByLabelText(LABELS.subject), "Hello");
    expect(screen.getByText("95 characters left")).toBeInTheDocument();
  });

  it("updates the character counter as the user types in the message field", async () => {
    const user = userEvent.setup();
    render(<MessageForm onClick={jest.fn()} />);
    await user.type(screen.getByLabelText(LABELS.message), "Hi there");
    expect(screen.getByText("992 characters left")).toBeInTheDocument();
  });

  it("calls the onClick prop when the close button is clicked", async () => {
    const user = userEvent.setup();
    const onClick = jest.fn();
    render(<MessageForm onClick={onClick} />);
    await user.click(screen.getByRole("button", { name: "Close" }));
    expect(onClick).toHaveBeenCalledTimes(1);
  });

  it("toggles direction from ltr to rtl when the align-right button is clicked", async () => {
    const user = userEvent.setup();
    render(<MessageForm onClick={jest.fn()} />);
    await user.click(screen.getByRole("button", { name: "Align right" }));
    expect(
      screen.getByLabelText(LABELS.email).closest("[dir]"),
    ).toHaveAttribute("dir", "rtl");
  });

  async function fillRequiredFields(user: ReturnType<typeof userEvent.setup>) {
    await user.type(screen.getByLabelText(LABELS.email), "me@example.com");
    await user.type(screen.getByLabelText(LABELS.subject), "Hello there");
    await user.type(screen.getByLabelText(LABELS.message), "Hi, this is a message");
  }

  it("shows a sending status message while the action is pending", async () => {
    const user = userEvent.setup();
    let resolveAction: (value: { success: boolean; message: string }) => void = () => {};
    sendEmailMock.mockReturnValue(
      new Promise((resolve) => {
        resolveAction = resolve;
      }),
    );

    render(<MessageForm onClick={jest.fn()} />);
    await fillRequiredFields(user);
    await user.click(screen.getByRole("button", { name: "Send" }));

    expect(await screen.findByText("Sending...")).toBeInTheDocument();

    resolveAction({ success: true, message: "Message sent" });
    await waitFor(() =>
      expect(screen.queryByText("Sending...")).not.toBeInTheDocument(),
    );
  });

  it("calls sendEmail with the submitted form data", async () => {
    const user = userEvent.setup();
    sendEmailMock.mockResolvedValue({ success: true, message: "Message sent" });

    render(<MessageForm onClick={jest.fn()} />);
    await fillRequiredFields(user);
    await user.click(screen.getByRole("button", { name: "Send" }));

    await waitFor(() => expect(sendEmailMock).toHaveBeenCalledTimes(1));
    const formData = sendEmailMock.mock.calls[0][1] as FormData;
    expect(formData.get("fromInput")).toBe("me@example.com");
  });

  it("displays the resolved success message after submission", async () => {
    const user = userEvent.setup();
    sendEmailMock.mockResolvedValue({ success: true, message: "Message sent" });

    render(<MessageForm onClick={jest.fn()} />);
    await fillRequiredFields(user);
    await user.click(screen.getByRole("button", { name: "Send" }));

    expect(await screen.findByText("Message sent")).toBeInTheDocument();
  });

  it("displays the resolved failure message after submission", async () => {
    const user = userEvent.setup();
    sendEmailMock.mockResolvedValue({
      success: false,
      message: "Message not sent",
    });

    render(<MessageForm onClick={jest.fn()} />);
    await fillRequiredFields(user);
    await user.click(screen.getByRole("button", { name: "Send" }));

    expect(await screen.findByText("Message not sent")).toBeInTheDocument();
  });
});
