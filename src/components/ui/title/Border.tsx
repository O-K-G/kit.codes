import { BorderProps } from "@constants/interfaces";
import styles from "./Border.module.css";

export default function Border({
  className = "",
  leftLabel,
  rightLabel,
  isTextBlink,
}: BorderProps) {
  return (
    <div
      data-reverse={!!leftLabel}
      className={styles.border}
    >
      <div
        className={`${styles.line} ${className}`}
      />
      {(rightLabel ?? leftLabel) && (
        <span
          data-blink={isTextBlink}
          className={styles.label}
        >
          {rightLabel ?? leftLabel}
        </span>
      )}
    </div>
  );
}
