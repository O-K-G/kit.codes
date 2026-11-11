"use client";

import { useRef, useState } from "react";
import AboutTargetIcon from "@ui/expandableButton/AboutTargetIcon";
import { ExpandableButtonProps } from "@constants/interfaces";
import { useTranslations } from "next-intl";
import styles from "./ExpandableButton.module.css";

export default function ExpandableButton({
  alternativeLabel,
}: ExpandableButtonProps) {
  const [open, setOpen] = useState(false);
  const [isAnimationEnd, setAnimationEnd] = useState(true);
  const t = useTranslations("expandableButtonText");
  const buttonRef = useRef(null);

  const handleTextAnimation = () => {
    setAnimationEnd(true);
    (buttonRef.current as unknown as HTMLButtonElement).removeEventListener(
      "animationend",
      handleTextAnimation
    );
  };

  const handleClick = () => {
    setOpen((prevValue) => !prevValue);
    setAnimationEnd(false);
    (buttonRef.current as unknown as HTMLButtonElement).addEventListener(
      "animationend",
      handleTextAnimation
    );
  };

  return (
    <div className={styles.container}>
      <div
        data-open={open}
        className={styles.frame}
      >
        <AboutTargetIcon open={open} />
        <div
          role="button"
          tabIndex={0}
          ref={buttonRef}
          aria-label={!open ? t("clickToOpen") : alternativeLabel}
          aria-expanded={open}
          data-open={open}
          className={`${styles.button} ${
            !isAnimationEnd ? "" : styles.animationEnded
          }`}
          onClick={handleClick}
          onKeyDown={handleClick}
        >
          <span className={styles.label}>
            {isAnimationEnd && (!open ? t("clickToOpen") : alternativeLabel)}
          </span>
        </div>
        <AboutTargetIcon bottom open={open} />
      </div>
    </div>
  );
}
