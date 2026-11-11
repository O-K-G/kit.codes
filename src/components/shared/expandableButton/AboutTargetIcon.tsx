import { AboutTargetIconProps } from "@constants/interfaces";
import styles from "./AboutTargetIcon.module.css";

export default function AboutTargetIcon({
  bottom,
  open,
}: AboutTargetIconProps) {
  const className = !bottom ? styles.topCorner : styles.bottomCorner;

  return (
    <div
      data-open={open}
      className={`${styles.icon} ${className}`}
    >
      <div
        data-open={open}
        className={styles.bracket}
      />
    </div>
  );
}
