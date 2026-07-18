"use client";

import { KeyboardEventHandler, MouseEventHandler } from "react";
import Link from "next/link";
import typographyStyles from "@ui/typography/typography.module.css";
import { concatStyles } from "@utils/concatStyles";
import styles from "./navLink.module.css";
import { useRouter } from "next/navigation";

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
  const router = useRouter();

  const handleEvents = () => {
    const el = document.getElementById(id);
    const fallbackUrl = `/#${id}`;

    if (el) {
      return el?.scrollIntoView({
        behavior: "smooth",
        block: "start",
        inline: "nearest",
      });
    }

    router.push(fallbackUrl);
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
