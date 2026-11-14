import { IconButtonProps } from "@constants/interfaces";
import styles from "./IconButton.module.css";

export default function IconButton({
  icon,
  className = "",
  ...rest
}: IconButtonProps) {
  return (
    <button
      type="button"
      {...rest}
      className={`${styles.button} ${className}`}
    >
      {icon}
    </button>
  );
}
