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

    if (key === "Enter" || key === " ") {
      e.preventDefault();
      handleEvents();
    }

    const nextEl = allLinks[currentLinkIndex + 1];
    const previousEl = allLinks[currentLinkIndex - 1];
    const firstEl = allLinks[0];
    const lastEl = allLinks.at(-1);

    if (key === "ArrowLeft") {
      if (previousEl) {
        return previousEl.focus();
      }
      lastEl!.focus();
    }

    if (key === "ArrowRight") {
      if (nextEl) {
        return nextEl.focus();
      }
      firstEl.focus();
    }

    if (key === "Home") {
      firstEl.focus();
    }

    if (key === "End") {
      lastEl!.focus();
    }
  };

  return (
    <Link
      onClick={handleClick}
      onKeyDown={handleKeyDown}
      className={concatStyles([typographyStyles.typography, styles.navLink])}
      data-variant="floor-btn"
      href="#"
      {...rest}
    >
      {label}
    </Link>
  );
}
