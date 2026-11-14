import { IconButtonProps } from "@constants/interfaces";
import styles from "./IconButton.module.css";
import classNames from "@utils/classNames";

export default function IconButton({
  icon,
  className,
  ...rest
}: IconButtonProps) {
  return (
    <button
      type="button"
      {...rest}
      className={classNames(styles.button, className)}
    >
      {icon}
    </button>
  );
}
