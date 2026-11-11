import { useTranslations } from "next-intl";
import { ModalContext as modalContext } from "@ui/modalContext/ModalContext";
import DialogTitle from "@ui/dialog/DialogTitle";
import styles from "./Shenanigans.module.css";
import {
  useContext,
  MouseEventHandler,
  ReactNode,
  KeyboardEventHandler,
} from "react";

const COMPONENT_ID = "shenanigans-id";

function OldschoolButton({
  children,
  onClick,
}: {
  children: ReactNode;
  onClick: MouseEventHandler<HTMLButtonElement>;
}) {
  return (
    <button
      onClick={onClick}
      className={styles.oldschoolButton}
      type="button"
    >
      <span className={styles.oldschoolButtonLabel}>
        {children}
      </span>
    </button>
  );
}

function ShenanigansComponent() {
  const { onCloseModal } = useContext(modalContext);
  const t = useTranslations("shenanigansText");

  const handleClick = (e: Event) => {
    const { id } = (e.target as HTMLDivElement) || {};
    if (id === COMPONENT_ID) {
      onCloseModal(e);
    }
  };

  return (
    <div
      onClick={handleClick as unknown as MouseEventHandler<HTMLDivElement>}
      onKeyDown={handleClick as unknown as KeyboardEventHandler<HTMLDivElement>}
      id={COMPONENT_ID}
      role="presentation"
      className={styles.backdrop}
    >
      <div className={styles.window}>
        <DialogTitle
          className={styles.dialogTitle}
          label={t("mainTitle")}
          onClick={onCloseModal}
          closeButtonIcon={
            <div className={styles.closeButtonIcon} />
          }
        />
        <div className={styles.windowBody}>
          <div className={styles.windowContent}>
            <h2 className={`${styles.heading} ${styles.headingBold}`}>
              {t("wow")}
            </h2>
            <h3 className={styles.heading}>
              {t("make")}
            </h3>
            <div className={styles.srOnly}>{t("graphics")}</div>
            <p className={styles.message}>
              {t("yourApp")}
              <br />
              {t("nineties")}
              <br />
              {t("fax")}
              <br />
              {t("like")}
              <br />
              {t("quit")}
            </p>
            <div className={styles.quitButtonWrapper}>
              <OldschoolButton onClick={onCloseModal}>
                {t("quitShenanigans")}
              </OldschoolButton>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function Shenanigans() {
  const { onModalContentChange: setModalContent } = useContext(modalContext);
  const t = useTranslations("shenanigansText");

  return (
    <button
      type="button"
      className={styles.button}
      onClick={() => setModalContent(<ShenanigansComponent />)}
    >
      {t("shenanigansButton")}
    </button>
  );
}
