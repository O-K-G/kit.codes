import styles from "./dialog.module.css";
import {
  ReactNode,
  TransitionEvent,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from "react";

type DialogProps = {
  "aria-label": string;
  children: ReactNode;
  open: boolean;
  onClose: () => void;
};

const FOCUSABLE_SELECTOR =
  'a[href], button:not([disabled]), textarea:not([disabled]), input:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])';

export default function Dialog({
  "aria-label": ariaLabel,
  children,
  open,
  onClose,
  ...rest
}: DialogProps) {
  const [shouldRender, setShouldRender] = useState(open);
  const [prevOpen, setPrevOpen] = useState(open);
  const backdropRef = useRef<HTMLDivElement>(null);
  const dialogRef = useRef<HTMLDivElement>(null);

  if (open !== prevOpen) {
    setPrevOpen(open);

    if (open) {
      setShouldRender(true);
    }
  }

  useLayoutEffect(() => {
    if (!open) {
      const activeElement = document.activeElement as HTMLElement | null;
      if (activeElement && backdropRef.current?.contains(activeElement)) {
        activeElement.blur();
      }
      return;
    }

    const firstFocusable =
      dialogRef.current?.querySelector<HTMLElement>(FOCUSABLE_SELECTOR);
    (firstFocusable ?? dialogRef.current)?.focus();
  }, [open]);

  const handleTransitionEnd = (e: TransitionEvent<HTMLDivElement>) => {
    if (e.target !== e.currentTarget) {
      return;
    }

    if (!open) {
      setShouldRender(false);
    }
  };

  useEffect(() => {
    const backdrop = backdropRef.current;
    const dialog = dialogRef.current;
    if (!backdrop || !dialog) {
      return;
    }

    const handleBackdropClick = (e: MouseEvent) => {
      if (e.target === e.currentTarget) {
        onClose();
      }
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
        return;
      }

      if (e.key !== "Tab") {
        return;
      }

      const focusable = Array.from(
        dialog.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTOR),
      );

      if (focusable.length === 0) {
        e.preventDefault();
        return;
      }

      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      const isInDialog = dialog.contains(document.activeElement);

      if (e.shiftKey) {
        if (!isInDialog || document.activeElement === first) {
          e.preventDefault();
          last.focus();
        }
      } else if (!isInDialog || document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    };

    backdrop.addEventListener("click", handleBackdropClick);
    dialog.addEventListener("keydown", handleKeyDown);

    return () => {
      backdrop.removeEventListener("click", handleBackdropClick);
      dialog.removeEventListener("keydown", handleKeyDown);
    };
  }, [shouldRender, onClose]);

  if (!shouldRender) {
    return null;
  }

  return (
    <div
      ref={backdropRef}
      data-open={open}
      className={styles.backdrop}
      onTransitionEnd={handleTransitionEnd}
    >
      <div
        ref={dialogRef}
        role="dialog"
        aria-label={ariaLabel}
        aria-modal={open}
        tabIndex={-1}
        {...rest}
      >
        {children}
      </div>
    </div>
  );
}
