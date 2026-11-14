"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import Dialog from "@ui/dialog/Dialog";
import DialogTitle from "@ui/dialog/DialogTitle";
import { URLs } from "@constants/urls";
import styles from "./Attribution.module.css";

function AttributionContent() {
  const t = useTranslations("attributionText");
  const { figmaAttribution, ccbyLicense } = URLs;

  return (
    <div
      dir="ltr"
      className={styles.content}
    >
      <DialogTitle label={t("title")} />
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
  const [open, setOpen] = useState(false);
  const t = useTranslations("attributionText");

  return (
    <>
      <button type="button" className={styles.button} onClick={() => setOpen(true)}>
        {t("title")}
      </button>
      <Dialog open={open} onClose={() => setOpen(false)}>
        <AttributionContent />
      </Dialog>
    </>
  );
}
