import { ReactNode, TransitionEventHandler, useEffect, useRef } from "react";
import styles from "./dialog.module.css";

type DialogProps = {
  "aria-label": string;
  children: ReactNode;
};

export function openCloseDialog() {
  const backdropEl = document.querySelector(
    "[data-modal-open]",
  ) as HTMLDivElement;

  const dialogEl = document.querySelector('[role="dialog"]');
  const isModalClose = backdropEl!.dataset.modalOpen === "false";

  if (isModalClose) {
    backdropEl!.dataset.modalOpen = "true";
    backdropEl!.ariaHidden = "false";
    return (dialogEl!.ariaModal = "true");
  }

  backdropEl!.dataset.modalOpen = "false";
  const currentActive = document.activeElement as HTMLElement;
  if (currentActive && currentActive !== document.body) {
    currentActive?.blur();
  }

  backdropEl!.ariaHidden = "true";
  dialogEl!.ariaModal = "false";
}

export default function Dialog({
  "aria-label": ariaLabel,
  children,
  ...rest
}: DialogProps) {
  const dialogRef = useRef<HTMLDivElement>(null);
  const focusableSelector =
    'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])';

  const handleTransitionEnd: TransitionEventHandler = (e) => {
    const el = e.target as HTMLDivElement;
    if (el.dataset.modalOpen === "true") {
      const firstElement = el.querySelectorAll(
        focusableSelector,
      )?.[0] as HTMLElement;

      if (firstElement) {
        firstElement.focus();
      }
    }
  };

  useEffect(() => {
    const { current } = dialogRef;

    const handleClick = (e: globalThis.KeyboardEvent) => {
      const { key, shiftKey } = e || {};

      if (key === "Escape") {
        openCloseDialog();
      }

      if (current) {
        const focusableElements = current!.querySelectorAll(focusableSelector);
        const firstElement = focusableElements[0] as HTMLElement;
        const { activeElement } = document || {};

        if (e.key !== "Tab") {
          return;
        }

        const lastElement = focusableElements[
          focusableElements.length - 1
        ] as HTMLElement;

        if (shiftKey) {
          if (activeElement === firstElement) {
            lastElement.focus();
            e.preventDefault();
          }
        } else {
          if (activeElement === lastElement) {
            firstElement.focus();
            e.preventDefault();
          }
        }
      }
    };

    window.addEventListener("keydown", handleClick);

    return () => window.removeEventListener("keydown", handleClick);
  }, []);

  return (
    <div
      data-modal-open="false"
      aria-hidden="true"
      className={styles.backdrop}
      onTransitionEnd={handleTransitionEnd}
    >
      <div
        ref={dialogRef}
        role="dialog"
        aria-label={ariaLabel}
        aria-modal="false"
        {...rest}
      >
        {children}
      </div>
    </div>
  );
}
