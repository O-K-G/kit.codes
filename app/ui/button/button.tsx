import Link, { LinkProps } from "next/link";
import { concatStyles } from "@utils/concatStyles";
import styles from "./button.module.css";
import {
  AnchorHTMLAttributes,
  ButtonHTMLAttributes,
  ElementType,
  ReactNode,
} from "react";


type BaseButtonProps = {
  children: ReactNode;
  /** Defaults to "outline-paper". */
  variant?: "outline-paper" | "fill-sky-deep" | "buzzer";
};

type HTMLButtonProps = BaseButtonProps &
  Omit<ButtonHTMLAttributes<HTMLButtonElement>, "component"> & {
    component?: "button";
    href?: never;
    rel?: never;
    target?: never;
  };

type HTMLLinkProps = BaseButtonProps &
  Omit<AnchorHTMLAttributes<HTMLAnchorElement>, "component" | "href"> &
  Omit<LinkProps, "as"> & {
    component: "a";
    href: string;
  };

export type ButtonProps = HTMLButtonProps | HTMLLinkProps;

export default function Button({
  type = "button",
  href,
  rel: relOverride,
  target: targetOverride,
  component = "button",
  className = "",
  children,
  variant = "outline-paper",
  ...rest
}: ButtonProps) {
  const buttonStyles = concatStyles([styles.buttonStyles, className]);
  const isButton = component === "button";

  const isExternal =
    href?.startsWith("http") ||
    href?.startsWith("mailto:") ||
    href?.startsWith("tel:");

  const aTagComponent = isExternal ? "a" : Link;
  const Component: ElementType = isButton ? "button" : aTagComponent;
  const rel = isExternal && "noreferrer";
  const target = isExternal ? "_blank" : "_self";

  const selectedProps = isButton
    ? { type }
    : { href, rel: relOverride || rel, target: targetOverride || target };

  return (
    <Component
      data-variant={variant}
      className={buttonStyles}
      data-component={component}
      {...selectedProps}
      {...rest}
    >
      {children}
    </Component>
  );
}
