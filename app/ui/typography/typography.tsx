import { ReactNode } from "react";
import styles from "./typography.module.css";
import { concatStyles } from "@/app/utils/concatStyles";

export type TypographyProps = {
  children: ReactNode;
  className?: string;

  /** Defaults to <p />. */
  component?:
    | "p"
    | "div"
    | "span"
    | "li"
    | "h1"
    | "h2"
    | "h3"
    | "h4"
    | "h5"
    | "h6";

  /** Defaults to "body". */
  variant?:
    | "body"
    | "hero-name"
    | "section-heading"
    | "card-heading"
    | "project-heading"
    | "eyebrow"
    | "hero-role"
    | "hero-tag"
    | "section-body"
    | "section-body-strong"
    | "nav-logo"
    | "floor-btn"
    | "button"
    | "unit-plate"
    | "unit-org"
    | "unit-notes"
    | "unit-tag"
    | "open-sign"
    | "project-body"
    | "stack-pill"
    | "project-link"
    | "cert-label"
    | "cert-stamp"
    | "skill-label"
    | "cert-also"
    | "intercom-head"
    | "buzzer"
    | "footer";

  /** Defaults to "paper". */
  color?:
    | "sky-deep"
    | "sky-warm"
    | "block"
    | "paper"
    | "mist"
    | "window"
    | "signage"
    | "add"
    | "del"
    | "block-border";
};

export default function Typography({
  component: Component = "p",
  children,
  className = "",
  color = "paper",
  variant = "body",
  ...rest
}: TypographyProps) {
  if (Component) {
    return (
      <Component
        data-variant={variant}
        data-color={color}
        className={concatStyles([styles.typography, className])}
        {...rest}
      >
        {children}
      </Component>
    );
  }

  return children;
}
