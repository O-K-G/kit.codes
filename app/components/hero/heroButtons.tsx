"use client";

import Button from "@ui/button/button";
import styles from "./heroButtons.module.css";
import { BUTTONS } from "./heroButtons.constants";
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
      href: BUTTONS.resume.url,
      component: "a",
    },
    {
      label: BUTTONS.gitHub.label,
      href: BUTTONS.gitHub.url,
      component: "a",
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
