import { ButtonHTMLAttributes, ReactNode } from "react";
import styles from "./iconButton.module.css";
import { concatStyles } from "@utils/concatStyles";

interface IconButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  "aria-label": string;
  circle?: boolean;

  /** Defaults to "outline-paper". */
  variant?: "outline-paper" | 'fill-sky-deep'

  /** Makes SVG icons get the variant's fill hover color, on button hover. Defaults to false. */
  groupFill?: boolean;

  /** Makes SVG icons get the variant's stroke hover color, on button hover. Defaults to false. */
  groupStroke?: boolean;
}

export default function IconButton({
  children,
  type = "button",
  className = "",
  "aria-label": ariaLabel,
  circle,
  variant = 'outline-paper',
  groupFill = false,
  groupStroke = false,
  ...rest
}: IconButtonProps) {
  return (
    <button
      type={type}
      aria-label={ariaLabel}
      data-variant={variant}
      className={concatStyles([styles.iconButton, className])}
      data-circle={circle}
      data-group-fill={groupFill}
      data-group-stroke={groupStroke}
      {...rest}
    >
      {children}
    </button>
  );
}
