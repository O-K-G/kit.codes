import styles from "./bottomBar.module.css";
import { DirTypes } from "./messageForm";
import { MouseEventHandler, ReactNode } from "react";
import IconButton from "@ui/iconButton/iconButton";
import AlignRightIcon from "@ui/iconComponents/alignRightIcon";
import AlignLeftIcon from "@ui/iconComponents/alignLeftIcon";
import SendIcon from "@ui/iconComponents/sendIcon";
import Typography from "@/app/ui/typography/typography";

const LEFT_BUTTON_LABEL = "Align left";
const RIGHT_BUTTON_LABEL = "Align right";
const SEND_BUTTON_LABEL = "Send";

type BottomBarProps = {
  dir: DirTypes;
  statusMessage?: ReactNode;
  onClick: MouseEventHandler;
};

export default function BottomBar({
  dir,
  onClick,
  statusMessage,
  ...rest
}: BottomBarProps) {
  const isLtr = dir === "ltr";

  return (
    <div className={styles.bottomBar} {...rest}>
      <div dir={dir} className={styles.directionButtons}>
        <IconButton
          aria-label={LEFT_BUTTON_LABEL}
          disabled={isLtr}
          onClick={onClick}
          groupFill
        >
          <AlignLeftIcon />
        </IconButton>

        <IconButton
          aria-label={RIGHT_BUTTON_LABEL}
          disabled={!isLtr}
          onClick={onClick}
          groupFill
        >
          <AlignRightIcon />
        </IconButton>
      </div>

      <div
        aria-live="polite"
        aria-atomic="true"
        className={styles.statusMessage}
      >
        {statusMessage && (
          <Typography component="span" color="paper" variant="section-body-strong">
            {statusMessage}
          </Typography>
        )}
      </div>

      <IconButton groupFill type="submit" aria-label={SEND_BUTTON_LABEL}>
        <SendIcon />
      </IconButton>
    </div>
  );
}
