"use client";

import { useState } from "react";
import AboutTargetIcon from "@ui/expandableButton/AboutTargetIcon";
import { ExpandableButtonProps } from "@constants/interfaces";
import { useTranslations } from "next-intl";
import styles from "./ExpandableButton.module.css";

export default function ExpandableButton({
  alternativeLabel,
}: ExpandableButtonProps) {
  /** `null` until the first toggle, so the label isn't hidden by the toggle animation on mount. */
  const [open, setOpen] = useState<boolean | null>(null);
  const isOpen = !!open;
  const t = useTranslations("expandableButtonText");

  const handleClick = () => setOpen((prevValue) => !prevValue);

  return (
    <div className={styles.container}>
      <div
        data-open={isOpen}
      >
        <AboutTargetIcon open={isOpen} />
        <div
          role="button"
          tabIndex={0}
          aria-label={!isOpen ? t("clickToOpen") : alternativeLabel}
          aria-expanded={isOpen}
          data-open={isOpen}
          data-toggled={open !== null}
          className={styles.button}
          onClick={handleClick}
          onKeyDown={handleClick}
        >
          <span>
            {!isOpen ? t("clickToOpen") : alternativeLabel}
          </span>
        </div>
        <AboutTargetIcon bottom open={isOpen} />
      </div>
    </div>
  );
}
