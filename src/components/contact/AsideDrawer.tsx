"use client";

import {
  ReactNode,
  TransitionEventHandler,
  createContext,
  useEffect,
  useRef,
  useState,
} from "react";
import { usePathname, useParams } from "next/navigation";
import ContactGoBackButton from "@components/contact/ContactGoBackButton";
import getDirByLocale from "@utils/getDirByLocale";
import styles from "./Aside.module.css";

export const AsideContext = createContext({
  open: false,
  onClose: () => {},
});

/**
 * The contact drawer, a modal dialog (WAI-ARIA APG dialog pattern): named by its open button's label.
 * While it's open the rest of the page is inert (out of reach of the keyboard, the pointer and
 * screen readers), focus moves into it once it's in place, Escape closes it, and closing it returns
 * focus to its open button.
 */
export default function AsideDrawer({
  openButtonLabel,
  children,
}: {
  openButtonLabel: string;
  children: ReactNode;
}) {
  const [open, setOpen] = useState<boolean | null>(null);
  const pathname = usePathname();
  const [openAtTransitionEnd, setOpenAtTransitionEnd] = useState(false);
  const { locale }: { locale: string } = useParams() || {};
  const asideRef = useRef<HTMLDivElement>(null);
  const openButtonRef = useRef<HTMLButtonElement>(null);
  const wasOpen = useRef(false);

  /** The rest of the page is inert while the drawer is open. Dialogs (e.g. the form's error dialog)
   * stay reachable: they're opened as native modals above it. */
  useEffect(() => {
    const aside = asideRef.current;
    if (!open || !aside) return;

    const outside = [
      ...Array.from(aside.parentElement?.children ?? []),
      ...Array.from(document.querySelectorAll("body > header")),
    ].filter(
      (element): element is HTMLElement =>
        element instanceof HTMLElement && element !== aside && element.tagName !== "DIALOG"
    );
    outside.forEach((element) => (element.inert = true));

    return () => outside.forEach((element) => (element.inert = false));
  }, [open]);

  /** Focus: into the drawer once its content is in place, back to the open button when it closes */
  useEffect(() => {
    if (openAtTransitionEnd) {
      asideRef.current
        ?.querySelector<HTMLElement>("button, a[href], input, textarea, [tabindex]")
        ?.focus();
    }
  }, [openAtTransitionEnd]);

  useEffect(() => {
    if (open) {
      wasOpen.current = true;
    } else if (open === false && wasOpen.current) {
      wasOpen.current = false;
      openButtonRef.current?.focus();
    }
  }, [open]);

  useEffect(() => {
    const handleClose = ({ key }: KeyboardEvent) => {
      if (key === "Escape") {
        setOpen(false);
      }
    };

    if (open === null && pathname?.includes(`${locale as string}/contact`)) {
      setOpenAtTransitionEnd(true);
      setOpen(true);
    }

    if (open) {
      window.addEventListener("keydown", handleClose);
    }

    return () => window.removeEventListener("keydown", handleClose);
  }, [locale, open, pathname]);

  const handleTransitionEnd = ({
    target,
  }: {
    target: TransitionEventHandler<HTMLElement>;
  }) => {
    let touchX = 0;
    const el = target as unknown as HTMLElement;

    const handleTouchMove = (e: Event) => {
      const dir = getDirByLocale({ locale });
      const isLTR = dir === "ltr";
      const slideDifference = isLTR
        ? touchX - (e as TouchEvent).touches[0].clientX
        : (e as TouchEvent).touches[0].clientX - touchX;

      const sensitivityFactor = slideDifference > 50;

      const touchEnd = isLTR
        ? touchX > (e as TouchEvent).touches[0].clientX
        : touchX < (e as TouchEvent).touches[0].clientX;

      if (touchEnd && sensitivityFactor) {
        el?.removeEventListener("touchmove", handleTouchMove);
        setOpen(false);
      }
    };

    const handleTouchStart = (e: Event) => {
      touchX = (e as TouchEvent).touches[0].clientX;
      el?.removeEventListener("touchstart", handleTouchStart);
      el?.addEventListener("touchmove", handleTouchMove);
    };

    if (!open) {
      setOpenAtTransitionEnd(false);
    } else {
      el?.addEventListener("touchstart", handleTouchStart);
    }
  };

  return (
    <>
      <ContactGoBackButton
        ref={openButtonRef}
        onClick={() => {
          setOpenAtTransitionEnd(true);
          setOpen(true);
        }}
      >
        {openButtonLabel}
      </ContactGoBackButton>
      <div
        ref={asideRef}
        data-drawer
        role="dialog"
        aria-modal={!!open}
        aria-label={openButtonLabel}
        inert={!open}
        // Keeps the focused control's rings in view too (the scroll padding leaves room for them)
        onFocus={({ target }) => target.scrollIntoView?.({ block: "nearest" })}
        onTransitionEnd={
          handleTransitionEnd as unknown as TransitionEventHandler<HTMLElement>
        }
        aria-hidden={!open}
        className={styles.aside}
      >
        <AsideContext.Provider
          value={{ open: openAtTransitionEnd, onClose: () => setOpen(false) }}
        >
          {children}
        </AsideContext.Provider>
      </div>
    </>
  );
}
