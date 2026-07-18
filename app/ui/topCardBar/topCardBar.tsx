import Typography, { TypographyProps } from "@ui/typography/typography";
import styles from "./topCardBar.module.css";
import { ReactNode } from "react";
import { concatStyles } from "@utils/concatStyles";

type TopCardBarProps = {
  leftSlot: string;
  rightSlot: ReactNode;
  leftSlotColor: TypographyProps['color']
  className?: string
};

export default function TopCardBar({
  leftSlot,
  rightSlot,
  leftSlotColor,
  className = '',
  ...rest
}: TopCardBarProps) {
  const isRightSlotString = typeof rightSlot === "string";

  return (
    <div className={concatStyles([styles.topCardBar, className])} {...rest}>
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
