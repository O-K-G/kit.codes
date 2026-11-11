import { ContactGoBackButtonProps } from "@constants/interfaces";
import styles from "./ContactGoBackButton.module.css";

export const CONTACT_ME_BUTTON_TEST_ID = "contact-me-button-test";

export default function ContactGoBackButton({
  children,
  onClick,
  className = styles.defaultPosition,
}: ContactGoBackButtonProps) {
  return (
    <button
      data-testid={CONTACT_ME_BUTTON_TEST_ID}
      onClick={onClick}
      type="button"
      className={`${styles.button} ${className}`}
    >
      {children}
    </button>
  );
}
