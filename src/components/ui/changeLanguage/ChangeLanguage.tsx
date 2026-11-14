"use client";

import IconButton from "@ui/iconButton/IconButton";
import LanguageIcon from "@ui/icons/LanguageIcon";
import { usePathname, useRouter, useParams } from "next/navigation";
import { useTranslations } from "next-intl";
import { DIRECTION_BY_LANGUAGE } from "@constants/LocaleDirection";
import { ModalContext as modalContext } from "@ui/modalContext/ModalContext";
import DialogTitle from "@ui/dialog/DialogTitle";
import { useContext } from "react";
import { SelectLanguageButtonProps } from "@constants/interfaces";
import styles from "./ChangeLanguage.module.css";

function SelectLanguageButton({ label, value }: SelectLanguageButtonProps) {
  const { locale } = useParams() || {};
  const pathname = usePathname();
  const isCurrentLocale = locale === value;
  const router = useRouter();
  const { onCloseModal } = useContext(modalContext);

  return (
    <li>
      {/* Each name is written in its own language (WCAG 3.1.2); the current one is marked for screen
       * readers too, not only by its color (WCAG 1.4.1) */}
      <button
        lang={value}
        aria-current={isCurrentLocale || undefined}
        data-current-locale={isCurrentLocale}
        onClick={(e) => {
          onCloseModal(e);
          if (!isCurrentLocale) {
            router.push(pathname.replace(`/${locale as string}`, `/${value}`));
          }
        }}
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
  const { onCloseModal } = useContext(modalContext);

  return (
    <div className={styles.languagesList}>
      <DialogTitle
        label={t("changeLanguage")}
        onClick={onCloseModal}
      />
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
  const { onModalContentChange: setModalContent } = useContext(modalContext);
  const t = useTranslations("languageSelect");

  return (
    <IconButton
      className={styles.iconButton}
      onClick={() => setModalContent(<LanguagesList />)}
      icon={<LanguageIcon />}
      aria-label={t("changeLanguage")}
    />
  );
}
