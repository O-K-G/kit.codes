import { AboutTargetIconProps } from "@constants/interfaces";
import styles from "./AboutTargetIcon.module.css";
import classNames from "@utils/classNames";

export default function AboutTargetIcon({
  bottom,
  open,
  blink = false,
  running = true,
}: AboutTargetIconProps) {
  const className = !bottom ? styles.topCorner : styles.bottomCorner;

  return (
    <div
      data-open={open}
      data-blink={blink}
      data-running={running}
      className={classNames(styles.icon, className)}
    >
      <div
        data-open={open}
        data-blink={blink}
        data-running={running}
        className={styles.bracket}
      />
    </div>
  );
}
