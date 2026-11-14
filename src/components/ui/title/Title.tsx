import { MainTitleProps } from "@constants/interfaces";
import Border from "@ui/title/Border";
import styles from "./Title.module.css";
import classNames from "@utils/classNames";

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
    <div className={classNames(styles.wrapper, className)}>
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
