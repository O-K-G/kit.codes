import { MouseEvent } from "react";
import { useTranslations } from "next-intl";
import AlignLeftIcon from "@components/contact/AlignLeftIcon";
import { BottomInputComponentButtonsProps } from "@constants/interfaces";
import { useFormStatus } from "react-dom";
import styles from "./BottomInputComponentButtons.module.css";

export default function BottomInputComponentButtons({
  dir,
  onClick,
  leftSlot,
  onSubmit,
}: BottomInputComponentButtonsProps) {
  const { pending: isLoading } = useFormStatus();
  /** Only while sending: with errors it stays usable, sending again shows them again */
  const isBusy = isLoading;
  const t = useTranslations("inputComponentText");
  const isLTR = dir === "ltr";

  /** While sending, a click does nothing (the button is aria-disabled, not disabled, see below) */
  const handleSubmitClick = (event: MouseEvent<HTMLButtonElement>) => {
    if (isBusy) {
      event.preventDefault();
      return;
    }
    onSubmit();
  };

  /** Switches the form's text to the other direction */
  const handleAlignClick = () => onClick?.(isLTR ? "rtl" : "ltr");

  return (
    <div className={styles.container}>
      <div className={styles.leftSlot}>
        {leftSlot}
      </div>
      <div className={styles.center}>
        {/* aria-disabled rather than disabled while sending: a disabled button would drop the focus
         * (WCAG 2.4.3), so it couldn't come back to it, e.g. from the error dialog */}
        <button
          aria-disabled={isBusy || undefined}
          type="submit"
          onClick={handleSubmitClick}
          className={styles.submitButton}
        >
          {t("send")}
        </button>
      </div>
      <div className={styles.end}>
        <button
          aria-label={`${t("alignFormText")} ${t(isLTR ? "right" : "left")}`}
          onClick={handleAlignClick}
          type="button"
        >
          <AlignLeftIcon className={styles.alignIcon} />
        </button>
      </div>
    </div>
  );
}
