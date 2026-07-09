import Typography, { TypographyProps } from "@ui/typography/typography";
import styles from "./card.module.css";
import { concatStyles } from "@/app/utils/concatStyles";
import { ReactNode } from "react";
import TopCardBar from "@ui/topCardBar/topCardBar";

type CardProps = {
  leftSlot: string;
  rightSlot: ReactNode;
  title: string;
  subtitle: string;
  children?: ReactNode;
  leftBorder?: "window" | "signage";
  leftSlotColor: TypographyProps["color"];
  className?: string;

  /** If true, the card will move up 10px on hover. */
  hoverEffect?: boolean;

  /** Defaults to 'div'. */
  component?: "div" | "li";
};

export default function Card({
  leftSlot,
  rightSlot,
  title,
  subtitle,
  children,
  leftBorder,
  leftSlotColor,
  hoverEffect,
  component: Component = "div",
  className = "",
  ...rest
}: CardProps) {
  return (
    <Component
      data-left-border={leftBorder}
      data-hover-effect={hoverEffect}
      className={concatStyles([styles.card, className])}
      {...rest}
    >
      <TopCardBar
        leftSlot={leftSlot}
        rightSlot={rightSlot}
        leftSlotColor={leftSlotColor}
      />

      <Typography component="h3" variant="card-heading" color="paper">
        {title}
      </Typography>

      <Typography component="p" variant="unit-org" color="mist">
        {subtitle}
      </Typography>

      {children}
    </Component>
  );
}
