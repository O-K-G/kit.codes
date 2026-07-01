import { concatStyles } from "@/app/utils/concatStyles";
import styles from "./button.module.css";
import { ButtonHTMLAttributes, ReactNode } from "react";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;

  /** Defaults to "outline-paper". */
  variant?: "outline-paper" | 'fill-sky-deep'
}

export default function Button({
  type = "button",
  className = "",
  children,
  variant = 'outline-paper',
  ...rest
}: ButtonProps) {
  const buttonStyles = concatStyles([styles.buttonStyles, className]);

  return (
    <button data-variant={variant} type={type} className={buttonStyles} {...rest}>
      {children}
    </button>
  );
}
