"use client";

import { MouseEventHandler } from "react";
import Link from "next/link";
import typographyStyles from "@ui/typography/typography.module.css";
import { concatStyles } from "@utils/concatStyles";
import styles from "./navLink.module.css";

type NavLinkProps = {
  label: string;
};

export default function NavLink({ label, ...rest }: NavLinkProps) {
  const handleClick: MouseEventHandler = (e) => e.preventDefault();

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
