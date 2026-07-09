import Typography, { TypographyProps } from "@ui/typography/typography";
import styles from "./topCardBar.module.css";
import { ReactNode } from "react";

type TopCardBarProps = {
  leftSlot: string;
  rightSlot: ReactNode;
  leftSlotColor: TypographyProps['color']
};

export default function TopCardBar({
  leftSlot,
  rightSlot,
  leftSlotColor,
  ...rest
}: TopCardBarProps) {
  const isRightSlotString = typeof rightSlot === "string";

  return (
    <div className={styles.topCardBar} {...rest}>
      <Typography component="span" variant="unit-plate" color={leftSlotColor}>
        {leftSlot}
      </Typography>

      {isRightSlotString ? (
        <Typography component="span" variant="unit-plate" color="mist">
          {rightSlot}
        </Typography>
      ) : (
        rightSlot
      )}
    </div>
  );
}
