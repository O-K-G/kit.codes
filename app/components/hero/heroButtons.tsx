"use client";

import Button from "@ui/button/button";
import styles from "./heroButtons.module.css";
import Dialog, { openCloseDialog } from "@ui/dialog/dialog";
import MessageForm from "./messageForm";
import { BUTTONS, DIALOG_ARIA_LABEL } from "./heroButtons.constants";
import { handleOpenExternalWindow } from "@utils/handleOpenExternalWindow";

export default function HeroButtons() {
  const buttons = [
    {
      label: BUTTONS.email.label,
      variant: "fill-sky-deep",
      onClick: openCloseDialog,
    },
    {
      label: BUTTONS.resume.label,
      onClick: () => handleOpenExternalWindow(BUTTONS.resume.url),
    },
    {
      label: BUTTONS.gitHub.label,
      onClick: () => handleOpenExternalWindow(BUTTONS.gitHub.url),
    },
  ] as const;

  return (
    <>
      <div className={styles.heroButtons}>
        {buttons.map(({ label, ...rest }) => (
          <Button key={label} {...rest}>
            {label}
          </Button>
        ))}
      </div>
      <Dialog aria-label={DIALOG_ARIA_LABEL}>
        <MessageForm />
      </Dialog>
    </>
  );
}
