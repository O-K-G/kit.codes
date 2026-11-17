import { MainTitleProps } from "@constants/interfaces";
import Border from "@ui/title/Border";
import styles from "./Title.module.css";
import classNames from "@utils/classNames";
import { CSSProperties } from "react";

export default function Title({
  children,
  component: Component = "h2",
  className,
  border,
  variant = "mainTitle",
  topLabel,
  bottomLabel,
  isDelayedAnimation,
  isRightLabelBlink,
}: MainTitleProps) {
  const animationClassName = isDelayedAnimation
    ? styles.delayedTyping
    : styles.typing;

  return (
    <div
      className={classNames(styles.wrapper, className)}
      // Its length, for a long title to shrink to fit on narrow screens (see .mainTitle)
      style={
        typeof children === "string"
          ? ({ "--title-length": children.length } as CSSProperties)
          : undefined
      }
    >
      {border && (
        <Border isTextBlink={isRightLabelBlink} rightLabel={topLabel} />
      )}
      <Component
        className={classNames(styles.title, animationClassName, styles[variant])}
      >
        {children}
      </Component>
      {border && <Border leftLabel={bottomLabel} />}
    </div>
  );
}
