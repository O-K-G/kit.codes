import { ReactNode, TransitionEventHandler, useRef } from "react";
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
  backdropEl!.ariaHidden = "true";
  dialogEl!.ariaModal = "false";
}

export default function Dialog({
  "aria-label": ariaLabel,
  children,
  ...rest
}: DialogProps) {
  const dialogRef = useRef<HTMLDivElement>(null);

  const handleTransitionEnd: TransitionEventHandler = (e) => {
    const el = e.target as HTMLDivElement;
    if (el.dataset.modalOpen === "false") {
      el.dataset.modalOpen = "false";
      el.ariaHidden = "true";
      dialogRef.current!.ariaModal = "false";
    }
  };

  return (
    <div
      data-modal-open="false"
      aria-hidden="true"
      className={styles.backdrop}
      onTransitionEnd={handleTransitionEnd}
    >
      <div ref={dialogRef} role="dialog" aria-label={ariaLabel} aria-modal="false" {...rest}>
        {children}
      </div>
    </div>
  );
}
