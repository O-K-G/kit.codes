import { ContactGoBackButtonProps } from "@constants/interfaces";
import styles from "./ContactGoBackButton.module.css";
import classNames from "@utils/classNames";

export default function ContactGoBackButton({
  className = styles.defaultPosition,
  ...rest
}: ContactGoBackButtonProps) {
  return (
    <button
      type="button"
      className={classNames(styles.button, className)}
      {...rest}
    />
  );
}
