"use client";

import { useContext } from "react";
import { ModalContext as modalContext } from "@ui/modalContext/ModalContext";
import { useTranslations } from "next-intl";
import DialogTitle from "@ui/dialog/DialogTitle";
import { URLs } from "@constants/urls";
import styles from "./Attribution.module.css";

function AttributionContent() {
  const { onCloseModal } = useContext(modalContext);
  const t = useTranslations("attributionText");
  const { figmaAttribution, ccbyLicense } = URLs;

  return (
    <div
      dir="ltr"
      className={styles.content}
    >
      <DialogTitle
        label={t("title")}
        onClick={onCloseModal}
      />
      <p>
        <span className={styles.inlineBlock}>{t("designBasedOn")}</span>
        <br />
        <a
          target="_blank"
          rel="noreferrer"
          href={figmaAttribution}
        >
          {figmaAttribution}
        </a>
        &nbsp;
        <span className={styles.inlineBlock}>{t("andUsedUnderThe")}</span>
        &nbsp;
        <a
          target="_blank"
          rel="noreferrer"
          href={ccbyLicense}
        >
          {t("ccby")}
        </a>
        &nbsp;
        <span className={styles.inlineBlock}>{t("license")}</span>
        &nbsp;
        <span className={styles.changes}>{t("changes")}</span>
      </p>
    </div>
  );
}

export default function Attribution() {
  const { onModalContentChange: setModalContent } = useContext(modalContext);
  const t = useTranslations("attributionText");

  return (
    <button
      type="button"
      className={styles.button}
      onClick={() => setModalContent(<AttributionContent />)}
    >
      {t("title")}
    </button>
  );
}
