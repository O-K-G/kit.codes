"use client";

import IconButton from "@ui/iconButton/IconButton";
import LanguageIcon from "@ui/icons/LanguageIcon";
import { usePathname, useRouter, useParams } from "next/navigation";
import { useTranslations } from "next-intl";
import { DIRECTION_BY_LANGUAGE } from "@constants/LocaleDirection";
import Dialog, { DialogContext } from "@ui/dialog/Dialog";
import DialogTitle from "@ui/dialog/DialogTitle";
import { useContext, useState } from "react";
import { SelectLanguageButtonProps } from "@constants/interfaces";
import styles from "./ChangeLanguage.module.css";

function SelectLanguageButton({ label, value }: SelectLanguageButtonProps) {
  const { locale } = useParams() || {};
  const pathname = usePathname();
  const isCurrentLocale = locale === value;
  const router = useRouter();
  const { onClose } = useContext(DialogContext);

  /** Closes the dialog, and switches to this language if it isn't the current one */
  const handleSelect = () => {
    onClose();
    if (!isCurrentLocale) {
      router.push(pathname.replace(`/${locale as string}`, `/${value}`));
    }
  };

  return (
    <li>
      {/* Each name is written in its own language (WCAG 3.1.2); the current one is marked for screen
       * readers too, not only by its color (WCAG 1.4.1) */}
      <button
        lang={value}
        aria-current={isCurrentLocale || undefined}
        data-current-locale={isCurrentLocale}
        onClick={handleSelect}
        type="button"
        value={value}
      >
        {label}
      </button>
    </li>
  );
}

function LanguagesList() {
  const t = useTranslations("languageSelect");

  return (
    <div className={styles.languagesList}>
      <DialogTitle label={t("changeLanguage")} />
      <ul>
        {Object.keys(DIRECTION_BY_LANGUAGE).map((str: string) => (
          <SelectLanguageButton
            key={`${str}-language`}
            label={t(str)}
            value={str as keyof typeof DIRECTION_BY_LANGUAGE}
          />
        ))}
      </ul>
    </div>
  );
}

export default function ChangeLanguage() {
  const [open, setOpen] = useState(false);
  const t = useTranslations("languageSelect");

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  return (
    <>
      <IconButton
        className={styles.iconButton}
        onClick={handleOpen}
        icon={<LanguageIcon />}
        aria-label={t("changeLanguage")}
      />
      <Dialog open={open} onClose={handleClose}>
        <LanguagesList />
      </Dialog>
    </>
  );
}
