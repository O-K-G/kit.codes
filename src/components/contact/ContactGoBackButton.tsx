import { ContactGoBackButtonProps } from "@constants/interfaces";
import styles from "./ContactGoBackButton.module.css";
import classNames from "@utils/classNames";

export const CONTACT_ME_BUTTON_TEST_ID = "contact-me-button-test";

export default function ContactGoBackButton({
  className = styles.defaultPosition,
  ...rest
}: ContactGoBackButtonProps) {
  return (
    <button
      data-testid={CONTACT_ME_BUTTON_TEST_ID}
      type="button"
      className={classNames(styles.button, className)}
      {...rest}
    />
  );
}
