"use client";

import { MouseEvent, SyntheticEvent, createContext, useEffect, useId, useRef } from "react";
import { DialogProps } from "@constants/interfaces";
import classNames from "@utils/classNames";
import styles from "./Dialog.module.css";

export const DIALOG_TEST_ID = "dialog-test-id";

/** What a dialog's content needs from it: its title's id (its name) and how to close it */
export const DialogContext = createContext({
  titleId: "",
  onClose: () => {},
});

/**
 * A modal dialog (WAI-ARIA APG dialog pattern), as the native <dialog> opened with showModal(): the
 * browser moves focus into it and keeps it there, makes the rest of the page inert, closes it on
 * Escape and returns focus to what opened it. `onClose` is called whenever it asks to close (Escape,
 * a click on its backdrop, or its title's close button, see DialogTitle), so the owner's state follows.
 * Named by its DialogTitle, or by an `aria-label`. It stays mounted, so it can animate in and out.
 */
export default function Dialog({
  open,
  onClose,
  children,
  className,
  onClick,
  ...rest
}: DialogProps) {
  const ref = useRef<HTMLDialogElement>(null);
  const titleId = useId();

  useEffect(() => {
    const dialog = ref.current;
    if (!dialog) {
      return;
    }

    if (open && !dialog.open) {
      dialog.showModal?.();
    }
    if (!open && dialog.open) {
      dialog.close?.();
    }
  }, [open]);

  /** The browser returns focus to what had it when the dialog opened. If that was nothing (the page),
   * focus goes to the dialog still open under this one, if any, rather than being lost (WCAG 2.4.3) */
  const restoreFocus = () => {
    if (document.activeElement && document.activeElement !== document.body) {
      return;
    }

    const below = Array.from(document.querySelectorAll<HTMLDialogElement>("dialog[open]")).at(-1);
    below
      ?.querySelector<HTMLElement>("button, a[href], input, textarea, select, [tabindex]")
      ?.focus();
  };

  /** Closed by the browser (Escape) too: the owner's state follows. Not when the owner closed it (it
   * already knows), nor for a dialog nested inside (React passes its "close" up the tree) */
  const handleClose = (event: SyntheticEvent<HTMLDialogElement>) => {
    if (event.target !== event.currentTarget) {
      return;
    }
    restoreFocus();
    if (open) {
      onClose();
    }
  };

  /** A click on the backdrop lands on the dialog itself */
  const handleClick = (event: MouseEvent<HTMLDialogElement>) => {
    if (event.target === event.currentTarget) {
      onClose();
    }
    onClick?.(event);
  };

  return (
    <dialog
      ref={ref}
      data-testid={DIALOG_TEST_ID}
      aria-labelledby={rest["aria-label"] ? undefined : titleId}
      onClose={handleClose}
      onClick={handleClick}
      className={classNames(styles.dialog, className)}
      {...rest}
    >
      <DialogContext.Provider value={{ titleId, onClose }}>
        {children}
      </DialogContext.Provider>
    </dialog>
  );
}
