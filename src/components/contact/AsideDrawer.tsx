"use client";

import {
  FocusEvent,
  ReactNode,
  TouchEvent,
  createContext,
  useRef,
  useState,
} from "react";
import { usePathname, useParams } from "next/navigation";
import ContactGoBackButton from "@components/contact/ContactGoBackButton";
import Dialog from "@ui/dialog/Dialog";
import getDirByLocale from "@utils/getDirByLocale";
import styles from "./Aside.module.css";

/** How far (px) a swipe towards the drawer's start edge must go to close it */
const SWIPE_CLOSE_DISTANCE = 50;

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
  /** Where the current touch started (its x), while the drawer is open */
  const touchStartX = useRef<number | null>(null);

  // Opened right away on the contact route, unless it's been opened or closed already. Set while
  // rendering rather than in an effect, which would render twice; the Dialog still opens (and
  // slides in) after mounting, from its own effect.
  if (open === null && pathname?.includes(`${locale as string}/contact`)) {
    setOpenAtTransitionEnd(true);
    setOpen(true);
  }

  /** Once it has slid out, its content is unmounted */
  const handleTransitionEnd = () => {
    if (!open) {
      setOpenAtTransitionEnd(false);
    }
  };

  const handleTouchStart = ({ touches }: TouchEvent<HTMLDialogElement>) => {
    touchStartX.current = open ? touches[0].clientX : null;
  };

  /** A swipe towards its start edge (left, or right in right-to-left languages) closes it */
  const handleTouchMove = ({ touches }: TouchEvent<HTMLDialogElement>) => {
    if (touchStartX.current === null) {
      return;
    }

    const moved = touches[0].clientX - touchStartX.current;
    const towardsStart = getDirByLocale({ locale }) === "rtl" ? moved : -moved;

    if (towardsStart > SWIPE_CLOSE_DISTANCE) {
      touchStartX.current = null;
      setOpen(false);
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
        onTransitionEnd={handleTransitionEnd}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
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
