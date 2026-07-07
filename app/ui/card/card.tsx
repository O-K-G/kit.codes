import Typography, { TypographyProps } from "@ui/typography/typography";
import styles from "./card.module.css";
import TopCardBar from "./topCardBar";
import { concatStyles } from "@/app/utils/concatStyles";
import { ReactNode } from "react";

type CardProps = {
  leftSlot: string;
  rightSlot: string;
  title: string;
  subtitle: string;
  children?: ReactNode;
  leftBorder?: "window" | "signage";
  leftSlotColor: TypographyProps["color"];
  className?: string;
};

export default function Card({
  leftSlot,
  rightSlot,
  title,
  subtitle,
  children,
  leftBorder,
  leftSlotColor,
  className = "",
  ...rest
}: CardProps) {
  return (
    <div
      data-left-border={leftBorder}
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
    </div>
  );
}
