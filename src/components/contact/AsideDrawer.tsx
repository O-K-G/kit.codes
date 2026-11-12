"use client";

import {
  ReactNode,
  TransitionEventHandler,
  createContext,
  useEffect,
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
        onClick={() => {
          setOpenAtTransitionEnd(true);
          setOpen(true);
        }}
      >
        {openButtonLabel}
      </ContactGoBackButton>
      <aside
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
      </aside>
    </>
  );
}
