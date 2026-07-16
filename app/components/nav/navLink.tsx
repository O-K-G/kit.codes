"use client";

import { KeyboardEventHandler, MouseEventHandler } from "react";
import Link from "next/link";
import typographyStyles from "@ui/typography/typography.module.css";
import { concatStyles } from "@utils/concatStyles";
import styles from "./navLink.module.css";

type NavLinkProps = {
  id: string;
  label: string;
  currentLinkIndex: number;
};

export default function NavLink({
  id,
  label,
  currentLinkIndex,
  ...rest
}: NavLinkProps) {
  const handleEvents = () => {
    const el = document.getElementById(id);

    el?.scrollIntoView({
      behavior: "smooth",
      block: "start",
      inline: "nearest",
    });
  };

  const handleClick: MouseEventHandler = (e) => {
    e.preventDefault();
    handleEvents();
  };

  const handleKeyDown: KeyboardEventHandler = (e) => {
    const { key } = e || {};
    const allLinks = Array.from(
      document.querySelectorAll('a[data-variant="floor-btn"]'),
    ) as HTMLElement[];

    const nextEl = allLinks[currentLinkIndex + 1];
    const previousEl = allLinks[currentLinkIndex - 1];
    const firstEl = allLinks[0];
    const lastEl = allLinks.at(-1);
    const lowercaseKey = key?.toLowerCase();
    const handleSelect = () => {
      e.preventDefault();
      handleEvents();
    };

    // Claude PR: Space activated this link like a button, which is non-standard —
    // native <a> elements only activate on Enter. Removed so keyboard behavior matches
    // what's actually exposed (a link), keeping the Home/End/Arrow roving-focus
    // enhancement below.
    const handleKeyStrokes = {
      home: () => firstEl.focus(),
      end: () => lastEl!.focus(),
      enter: handleSelect,
      arrowleft: () => {
        if (previousEl) {
          return previousEl.focus();
        }
        lastEl!.focus();
      },

      arrowright: () => {
        if (nextEl) {
          return nextEl.focus();
        }
        firstEl.focus();
      },
    }[lowercaseKey];

    handleKeyStrokes?.();
  };

  return (
    // Claude PR: href was hardcoded to "#" regardless of the target section, so
    // right-click "copy link"/"open in new tab", middle-click, and the no-JS fallback
    // all did nothing useful. Pointing it at the section's real #id fixes all of those
    // while leaving the JS-enhanced smooth-scroll (still intercepted via preventDefault
    // in handleClick) unchanged.
    <Link
      onClick={handleClick}
      onKeyDown={handleKeyDown}
      className={concatStyles([typographyStyles.typography, styles.navLink])}
      data-variant="floor-btn"
      href={`#${id}`}
      {...rest}
    >
      {label}
    </Link>
  );
}
