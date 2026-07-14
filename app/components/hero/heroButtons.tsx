"use client";

import Button from "@ui/button/button";
import styles from "./heroButtons.module.css";
import { BUTTONS } from "./heroButtons.constants";
import { handleOpenExternalWindow } from "@utils/handleOpenExternalWindow";
import { useState } from "react";
import EmailDialog from "../shared/messageForm/emailDialog";

export default function HeroButtons() {
  const [open, setOpen] = useState(false);

  const buttons = [
    {
      label: BUTTONS.email.label,
      variant: "fill-sky-deep",
      onClick: () => setOpen(true),
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
      <EmailDialog open={open} onClose={() => setOpen(false)} />
    </>
  );
}
