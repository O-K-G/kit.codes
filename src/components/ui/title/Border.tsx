import { BorderProps } from "@constants/interfaces";
import styles from "./Border.module.css";

export default function Border({
  className,
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
        className={className}
      />
      {(rightLabel ?? leftLabel) && (
        <span
          data-blink={isTextBlink}
        >
          {rightLabel ?? leftLabel}
        </span>
      )}
    </div>
  );
}
