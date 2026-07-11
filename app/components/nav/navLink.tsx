"use client";

import { MouseEventHandler } from "react";
import Link from "next/link";
import typographyStyles from "@ui/typography/typography.module.css";
import { concatStyles } from "@utils/concatStyles";
import styles from "./navLink.module.css";

type NavLinkProps = {
  id: string;
  label: string;
};

export default function NavLink({ id, label, ...rest }: NavLinkProps) {
  const handleClick: MouseEventHandler = (e) => {
    e.preventDefault();
    const el = document.getElementById(id);
    
    el?.scrollIntoView({
      behavior: "smooth",
      block: "start",
      inline: "nearest",
    });
  };

  return (
    <Link
      onClick={handleClick}
      className={concatStyles([typographyStyles.typography, styles.navLink])}
      data-variant="floor-btn"
      href="#"
      {...rest}
    >
      {label}
    </Link>
  );
}
