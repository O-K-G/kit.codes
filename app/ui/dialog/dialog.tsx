import styles from "./dialog.module.css";
import {
  ReactNode,
  TransitionEvent,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from "react";
import { createPortal } from "react-dom";

type DialogProps = {
  "aria-label": string;
  children: ReactNode;
  open: boolean;
  onClose: () => void;
};

const FOCUSABLE_SELECTOR =
  'a[href]:not([tabindex="-1"]), button:not([disabled]):not([tabindex="-1"]), textarea:not([disabled]):not([tabindex="-1"]), input:not([disabled]):not([tabindex="-1"]), select:not([disabled]):not([tabindex="-1"]), [tabindex]:not([tabindex="-1"])';

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
  const previouslyFocusedRef = useRef<HTMLElement | null>(null);

  if (open !== prevOpen) {
    setPrevOpen(open);

    if (open) {
      setShouldRender(true);
    }
  }

  useLayoutEffect(() => {
    const main = document.querySelector("main");
    const nav = document.querySelector("nav");

    if (!open) {
      main?.removeAttribute("inert");
      nav?.removeAttribute("inert");

      const activeElement = document.activeElement as HTMLElement | null;
      if (activeElement && backdropRef.current?.contains(activeElement)) {
        activeElement.blur();
      }
      previouslyFocusedRef.current?.focus();
      previouslyFocusedRef.current = null;
      return;
    }

    previouslyFocusedRef.current = document.activeElement as HTMLElement | null;
    main?.setAttribute("inert", "");
    nav?.setAttribute("inert", "");

    const firstFocusable =
      dialogRef.current?.querySelector<HTMLElement>(FOCUSABLE_SELECTOR);
    (firstFocusable ?? dialogRef.current)?.focus();

    return () => {
      main?.removeAttribute("inert");
      nav?.removeAttribute("inert");
    };
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

  return createPortal(
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
    </div>,
    document.body,
  );
}
