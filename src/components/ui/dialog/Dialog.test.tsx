import { useState } from "react";
import { act, fireEvent, render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import { NextIntlClientProvider } from "next-intl";
import Dialog, { DIALOG_TEST_ID } from "@ui/dialog/Dialog";
import DialogTitle from "@ui/dialog/DialogTitle";
import { default as messages } from "@i18nEn/dialogComponentText.json";

/** jsdom doesn't implement showModal() / close(): toggle `open` (and fire "close") as browsers do */
beforeAll(() => {
  HTMLDialogElement.prototype.showModal = function showModal(this: HTMLDialogElement) {
    this.setAttribute("open", "");
  };
  HTMLDialogElement.prototype.close = function close(this: HTMLDialogElement) {
    this.removeAttribute("open");
    this.dispatchEvent(new Event("close"));
  };
});

function Owner({ onClose = jest.fn() }: { onClose?: () => void }) {
  const [open, setOpen] = useState(false);

  return (
    <NextIntlClientProvider locale="en" messages={messages}>
      <button type="button" onClick={() => setOpen(true)}>
        Open
      </button>
      <Dialog
        open={open}
        onClose={() => {
          onClose();
          setOpen(false);
        }}
      >
        <DialogTitle label="Settings" />
        <p>Content</p>
      </Dialog>
    </NextIntlClientProvider>
  );
}

describe("Dialog", () => {
  it("opens as a modal when its owner opens it, named by its title", () => {
    render(<Owner />);
    const dialog = screen.getByTestId(DIALOG_TEST_ID);
    expect(dialog).not.toHaveAttribute("open");

    fireEvent.click(screen.getByRole("button", { name: "Open" }));

    expect(dialog).toHaveAttribute("open");
    expect(screen.getByRole("dialog", { name: "Settings" })).toBe(dialog);
  });

  it("closes from its title's close button, and tells its owner", () => {
    const onClose = jest.fn();
    render(<Owner onClose={onClose} />);
    fireEvent.click(screen.getByRole("button", { name: "Open" }));

    fireEvent.click(screen.getByRole("button", { name: messages.dialogComponentText.close }));

    expect(onClose).toHaveBeenCalled();
    expect(screen.getByTestId(DIALOG_TEST_ID)).not.toHaveAttribute("open");
  });

  it("tells its owner when the browser closes it (Escape), and on a click on its backdrop", () => {
    const onClose = jest.fn();
    render(<Owner onClose={onClose} />);
    fireEvent.click(screen.getByRole("button", { name: "Open" }));
    const dialog = screen.getByTestId(DIALOG_TEST_ID);

    // As Escape does: the browser closes it, then fires "close"
    act(() => (dialog as HTMLDialogElement).close());
    expect(onClose).toHaveBeenCalledTimes(1);
    expect(dialog).not.toHaveAttribute("open");

    fireEvent.click(screen.getByRole("button", { name: "Open" }));
    fireEvent.click(dialog);
    expect(onClose).toHaveBeenCalledTimes(2);

    fireEvent.click(screen.getByText("Content"));
    expect(onClose).toHaveBeenCalledTimes(2);
  });
});
