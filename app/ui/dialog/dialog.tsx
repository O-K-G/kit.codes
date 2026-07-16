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

// Claude PR: previously only the catch-all `[tabindex]:not([tabindex="-1"])` branch
// excluded tabindex="-1" elements — the native-element branches (input/button/etc.)
// matched regardless of their tabindex. That meant the message form's honeypot field
// (now tabIndex={-1}, see messageForm.tsx) was still included in this trap's focusable
// list, so Shift+Tab wrap-around could programmatically focus it. Each branch now
// excludes tabindex="-1" explicitly.
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

  // Claude PR: two things were missing here. (1) Nothing marked the rest of the page
  // inert while this dialog was open, so screen reader users in browse mode could still
  // navigate into the nav/main content behind the (visually) modal dialog. (2) Focus was
  // moved into the dialog on open but never restored anywhere on close, so keyboard users
  // lost their place on the page. Both are handled in one effect because order matters:
  // `inert` must be removed from `main`/`nav` *before* we try to focus back into them,
  // since a browser refuses to focus anything inside an inert subtree.
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

  // Claude PR: this dialog is rendered inline from Rooftop, which is itself a
  // descendant of <main> — so marking <main> inert (above) was also inertizing the
  // dialog itself, silently breaking every focus behavior in this file (nothing inside
  // an inert subtree can receive focus). Portaling to document.body makes the dialog a
  // sibling of <main>/<nav> instead of a descendant, which is the standard pattern for
  // modals anyway (also sidesteps any ancestor overflow/stacking-context clipping).
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
