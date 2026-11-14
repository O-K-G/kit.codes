import { useTranslations } from "next-intl";
import AlignLeftIcon from "@components/contact/AlignLeftIcon";
import { BottomInputComponentButtonsProps } from "@constants/interfaces";
import { useFormStatus } from "react-dom";
import styles from "./BottomInputComponentButtons.module.css";

export default function BottomInputComponentButtons({
  dir,
  onClick,
  isSubmitDisabled,
  leftSlot,
  onSubmit,
}: BottomInputComponentButtonsProps) {
  const { pending: isLoading } = useFormStatus();
  const isBusy = isLoading ?? isSubmitDisabled;
  const t = useTranslations("inputComponentText");
  const isLTR = dir === "ltr";

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
          onClick={(event) => {
            if (isBusy) {
              event.preventDefault();
              return;
            }
            onSubmit();
          }}
          className={styles.submitButton}
        >
          {t("send")}
        </button>
      </div>
      <div className={styles.end}>
        <button
          aria-label={`${t("alignFormText")} ${t(isLTR ? "right" : "left")}`}
          onClick={() => onClick?.(isLTR ? "rtl" : "ltr")}
          type="button"
        >
          <AlignLeftIcon className={styles.alignIcon} />
        </button>
      </div>
    </div>
  );
}
