"use client";

import Button from "@ui/button/button";
import styles from "./heroButtons.module.css";
import { BUTTONS } from "./heroButtons.constants";
import { useState } from "react";
import EmailDialog from "../shared/messageForm/emailDialog";

export default function HeroButtons() {
  const [open, setOpen] = useState(false);
  const { email, resume, gitHub } = BUTTONS;

  const buttons = [
    {
      ...email,
      onClick: () => setOpen(true),
    },
    resume,
    gitHub,
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
