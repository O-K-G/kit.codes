"use client";

import {
  FocusEvent,
  ReactNode,
  TransitionEventHandler,
  createContext,
  useEffect,
  useState,
} from "react";
import { usePathname, useParams } from "next/navigation";
import ContactGoBackButton from "@components/contact/ContactGoBackButton";
import Dialog from "@ui/dialog/Dialog";
import getDirByLocale from "@utils/getDirByLocale";
import styles from "./Aside.module.css";

export const AsideContext = createContext({
  open: false,
  onClose: () => {},
});

/**
 * The contact drawer: a modal dialog (see Dialog) styled as a side panel that slides in, named by its
 * open button's label. The browser makes it modal: focus moves into it and stays there, the rest of
 * the page is inert, Escape closes it, and closing returns focus to its open button. Its content is
 * mounted while it's open (and until it has slid out). On touch screens, a swipe towards its start
 * edge closes it.
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

  /** Opened right away on the contact route */
  useEffect(() => {
    if (open === null && pathname?.includes(`${locale as string}/contact`)) {
      setOpenAtTransitionEnd(true);
      setOpen(true);
    }
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

  /** Its content is mounted right away, so it slides in with it */
  const handleOpen = () => {
    setOpenAtTransitionEnd(true);
    setOpen(true);
  };

  const handleClose = () => setOpen(false);

  /** Keeps the focused control's rings in view too (the scroll padding leaves room for them) */
  const handleFocus = ({ target }: FocusEvent<HTMLDialogElement>) =>
    target.scrollIntoView?.({ block: "nearest" });

  return (
    <>
      <ContactGoBackButton onClick={handleOpen}>
        {openButtonLabel}
      </ContactGoBackButton>
      <Dialog
        open={!!open}
        onClose={handleClose}
        aria-label={openButtonLabel}
        onFocus={handleFocus}
        onTransitionEnd={
          handleTransitionEnd as unknown as TransitionEventHandler<HTMLDialogElement>
        }
        className={styles.aside}
      >
        <AsideContext.Provider
          value={{ open: openAtTransitionEnd, onClose: handleClose }}
        >
          {children}
        </AsideContext.Provider>
      </Dialog>
    </>
  );
}
