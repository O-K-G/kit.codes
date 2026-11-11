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
        <button
          disabled={isBusy}
          type="submit"
          onClick={onSubmit}
          className={`${styles.submitButton} ${
            isBusy ? styles.submitButtonBusy : styles.submitButtonIdle
          }`}
        >
          {t("send")}
        </button>
      </div>
      <div className={styles.end}>
        <button
          aria-label={`${t("alignFormText")} ${t(isLTR ? "right" : "left")}`}
          onClick={() => onClick?.(isLTR ? "rtl" : "ltr")}
          type="button"
          className={styles.alignButton}
        >
          <AlignLeftIcon
            className={`${styles.alignIcon} ${
              isLTR ? styles.alignIconFlipped : ""
            }`}
          />
        </button>
      </div>
    </div>
  );
}
