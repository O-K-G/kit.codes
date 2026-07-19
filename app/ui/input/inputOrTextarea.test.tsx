import { render, screen } from "@testing-library/react";
import InputOrTextarea from "./inputOrTextarea";

describe("InputOrTextarea", () => {
  it("renders an <input> by default", () => {
    render(<InputOrTextarea dir="ltr" label="Name" />);
    expect(screen.getByLabelText("Name").tagName).toBe("INPUT");
  });

  it("renders a <textarea> when component='textarea'", () => {
    render(<InputOrTextarea dir="ltr" label="Message" component="textarea" />);
    expect(screen.getByLabelText("Message").tagName).toBe("TEXTAREA");
  });

  it("renders the label text", () => {
    render(<InputOrTextarea dir="ltr" label="Email" />);
    expect(screen.getByText("Email")).toBeInTheDocument();
  });

  it("uses a generated id from the label when no id is provided", () => {
    render(<InputOrTextarea dir="ltr" label="Phone Number" />);
    expect(screen.getByLabelText("Phone Number")).toHaveAttribute(
      "id",
      "input-Phone Number",
    );
  });

  it("uses the provided id when given", () => {
    render(<InputOrTextarea dir="ltr" label="Phone" id="custom-id" />);
    expect(screen.getByLabelText("Phone")).toHaveAttribute("id", "custom-id");
  });

  it("sanitizes the value on change and calls onChange with the clean value", () => {
    const onChange = jest.fn();
    render(<InputOrTextarea dir="ltr" label="Name" onChange={onChange} />);
    const input = screen.getByLabelText("Name") as HTMLInputElement;
    input.focus();

    Object.defineProperty(input, "value", {
      value: "hello",
      writable: true,
    });
    input.dispatchEvent(new Event("change", { bubbles: true }));

    expect(onChange).toHaveBeenCalledWith("hello");
  });

  it("marks the input invalid via data-error and aria-invalid on invalid event", () => {
    render(<InputOrTextarea dir="ltr" label="Name" required />);
    const input = screen.getByLabelText("Name");
    input.dispatchEvent(new Event("invalid", { bubbles: false, cancelable: true }));

    expect(input).toHaveAttribute("data-error", "true");
    expect(input).toHaveAttribute("aria-invalid", "true");
  });

  it("clears the error state on focus after being marked invalid", () => {
    render(<InputOrTextarea dir="ltr" label="Name" required />);
    const input = screen.getByLabelText("Name");
    input.dispatchEvent(new Event("invalid", { bubbles: false, cancelable: true }));
    expect(input).toHaveAttribute("data-error", "true");

    input.focus();

    expect(input).toHaveAttribute("data-error", "false");
    expect(input).toHaveAttribute("aria-invalid", "false");
  });

  it("renders children inside a wrapping div container", () => {
    render(
      <InputOrTextarea dir="ltr" label="Name">
        <span>helper text</span>
      </InputOrTextarea>,
    );
    expect(screen.getByText("helper text")).toBeInTheDocument();
  });

  it("sets data-text-area on the wrapper based on the component prop", () => {
    const { container } = render(
      <InputOrTextarea dir="ltr" label="Bio" component="textarea" />,
    );
    expect(container.querySelector('[data-text-area="true"]')).toBeInTheDocument();
  });

  it("passes maxLength and minLength through to the input", () => {
    render(<InputOrTextarea dir="ltr" label="Name" minLength={2} maxLength={10} />);
    const input = screen.getByLabelText("Name");
    expect(input).toHaveAttribute("maxlength", "10");
    expect(input).toHaveAttribute("minlength", "2");
  });

  it("associates aria-describedby with both the passed id and the generated error id", () => {
    render(
      <InputOrTextarea dir="ltr" label="Name" ariaDescribedBy="hint-id" id="name" />,
    );
    expect(screen.getByLabelText("Name")).toHaveAttribute(
      "aria-describedby",
      "hint-id name-error",
    );
  });

  it("renders an alert role element for the error message", () => {
    render(<InputOrTextarea dir="ltr" label="Name" id="name" />);
    expect(screen.getByRole("alert")).toHaveAttribute("id", "name-error");
  });

  it("clicking the error bubble fully resets the error state on the input", () => {
    const { container } = render(
      <InputOrTextarea dir="ltr" label="Name" id="name" required />,
    );
    const input = screen.getByLabelText("Name");
    input.dispatchEvent(
      new Event("invalid", { bubbles: false, cancelable: true }),
    );
    expect(input).toHaveAttribute("data-error", "true");
    expect(input).toHaveAttribute("aria-invalid", "true");

    const bubble = container.querySelector(
      "[data-error-message]",
    ) as HTMLElement;
    bubble.dispatchEvent(new Event("click", { bubbles: true }));

    expect(input).toHaveAttribute("data-error", "false");
    expect(input).toHaveAttribute("aria-invalid", "false");
    expect(bubble).toHaveAttribute("data-error-message", "");
    expect(screen.getByRole("alert")).toHaveTextContent("");
  });

  it("clicking the error bubble before any error is a no-op", () => {
    const { container } = render(
      <InputOrTextarea dir="ltr" label="Name" id="name" />,
    );
    const input = screen.getByLabelText("Name");
    const bubble = container.querySelector(
      "[data-error-message]",
    ) as HTMLElement;

    expect(() =>
      bubble.dispatchEvent(new Event("click", { bubbles: true })),
    ).not.toThrow();
    expect(input).toHaveAttribute("data-error", "false");
  });
});
