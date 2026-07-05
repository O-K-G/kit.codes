import Button from "@ui/button/button";
import styles from "./bottomBar.module.css";
import { DirTypes } from "./messageForm";
import { MouseEventHandler } from "react";

type BottomBarProps = {
  dir: DirTypes;
  onClick: MouseEventHandler;
};

export default function BottomBar({
  dir,
  onClick,
  ...rest
}: BottomBarProps) {
  return (
    <div className={styles.bottomBar} {...rest}>
      <div dir={dir} className={styles.directionButtons}>
        <Button disabled={dir === "ltr"} onClick={onClick}>
          L
        </Button>
        <Button disabled={dir === "rtl"} onClick={onClick}>
          R
        </Button>
      </div>

      <Button type="submit">Send</Button>
    </div>
  );
}
