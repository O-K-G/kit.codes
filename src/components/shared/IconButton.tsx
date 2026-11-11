import { IconButtonProps } from "@constants/interfaces";
import styles from "./IconButton.module.css";

export default function IconButton({
  onClick,
  disabled,
  "aria-label": ariaLabel,
  "data-testid": dataTestId,
  "data-pointer-events": dataPointerEvents,
  icon,
  className = "",
  ...rest
}: IconButtonProps) {
  return (
    <button
      data-testid={dataTestId}
      data-pointer-events={dataPointerEvents}
      onClick={onClick}
      disabled={disabled}
      type="button"
      className={`${styles.button} ${className}`}
      aria-label={ariaLabel}
      {...rest}
    >
      {icon}
    </button>
  );
}
