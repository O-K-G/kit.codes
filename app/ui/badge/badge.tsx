import styles from "./badge.module.css";
import Typography, { TypographyProps } from "@ui/typography/typography";

type BadgeProps = {
  borderBlink?: boolean;
  letterBlink?: boolean;
  label: string;
  rotate?: boolean;

  /** Use this as the letter that splits the label in the animation. */
  breakingLetter?: string;

  /** Defaults to 'signage'. */
  color?: TypographyProps["color"];

  /** Defaults to 'signage'. */
  borderColor?: "signage" | "block-border";
};

export default function Badge({
  borderBlink,
  letterBlink,
  label,
  breakingLetter,
  rotate,
  color = "signage",
  borderColor = "signage",
}: BadgeProps) {
  const badgeObjProps = {
    "data-rotate": rotate,
    "data-border-color": borderColor,
    className: styles.openSign,
    component: "span",
    color,
    variant: "open-sign",
  } as const;

  if (letterBlink && label && breakingLetter) {
    const splitLabel = label.split(breakingLetter);
    const start = splitLabel[0];
    const end = splitLabel[1];

    return (
      <Typography data-border-blink={borderBlink} {...badgeObjProps}>
        {start}
        <span data-letter-blink={letterBlink}>{breakingLetter}</span>
        {end}
      </Typography>
    );
  }

  return <Typography {...badgeObjProps}>{label}</Typography>;
}
