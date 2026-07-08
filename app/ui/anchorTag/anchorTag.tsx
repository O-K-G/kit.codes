import { concatStyles } from "@/app/utils/concatStyles";
import styles from "./anchorTag.module.css";
import { AnchorHTMLAttributes } from "react";

/** For external web pages only. For internal sources, use Next's <Link />. */

interface AnchorTagProps extends AnchorHTMLAttributes<HTMLAnchorElement> {
  /** 'target' defaults to '_blank', 'rel' defaults to 'noreferrer'. */
  children: string;
}

export default function AnchorTag({
  children,
  className = "",
  target = "_blank",
  rel = "noreferrer",
  ...rest
}: AnchorTagProps) {
  return (
    <a
      target={target}
      rel={rel}
      className={concatStyles([styles.anchorTag, className])}
      {...rest}
    >
      {children}
    </a>
  );
}
