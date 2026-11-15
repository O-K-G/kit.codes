"use client";

import { useTranslations } from "next-intl";
import Dialog, { DialogContext } from "@ui/dialog/Dialog";
import DialogTitle from "@ui/dialog/DialogTitle";
import styles from "./Shenanigans.module.css";
import { useContext, useState, MouseEvent, MouseEventHandler, ReactNode } from "react";
import classNames from "@utils/classNames";

function OldschoolButton({
  children,
  ...rest
}: {
  children: ReactNode;
  onClick: MouseEventHandler<HTMLButtonElement>;
}) {
  return (
    <button
      type="button"
      {...rest}
    >
      <span className={styles.oldschoolButtonLabel}>
        {children}
      </span>
    </button>
  );
}

function ShenanigansComponent() {
  const { onClose } = useContext(DialogContext);
  const t = useTranslations("shenanigansText");

  /** A click on the backdrop itself (not on the window) */
  const handleBackdropClick = (event: MouseEvent<HTMLDivElement>) => {
    if (event.target === event.currentTarget) {
      onClose();
    }
  };

  return (
    // Its own full-screen backdrop (the "desktop"): a click on it closes the dialog, like a click on a
    // dialog's backdrop (Escape closes it too, see Dialog)
    <div
      onClick={handleBackdropClick}
      role="presentation"
      className={styles.backdrop}
    >
      <div>
        <DialogTitle
          className={styles.dialogTitle}
          label={t("mainTitle")}
          closeButtonIcon={
            <div className={styles.closeButtonIcon} />
          }
        />
        <div className={styles.windowBody}>
          <div>
            <h2 className={classNames(styles.heading, styles.headingBold)}>
              {t("wow")}
            </h2>
            <h3 className={styles.heading}>
              {t("make")}
            </h3>
            <div className={styles.srOnly}>{t("graphics")}</div>
            <p>
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
              <OldschoolButton onClick={onClose}>
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
  const [open, setOpen] = useState(false);
  const t = useTranslations("shenanigansText");

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  return (
    <>
      <button type="button" className={styles.button} onClick={handleOpen}>
        {t("shenanigansButton")}
      </button>
      <Dialog open={open} onClose={handleClose}>
        <ShenanigansComponent />
      </Dialog>
    </>
  );
}
