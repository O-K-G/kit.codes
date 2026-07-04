"use client";

import Button from "@ui/button/button";
import styles from "./heroButtons.module.css";
import Dialog, { openCloseDialog } from "@ui/dialog/dialog";

export default function HeroButtons() {
  const buttons = [
    {
      label: "Email me",
      variant: "fill-sky-deep",
      onClick: openCloseDialog,
    },
    { label: "Download Résumé", onClick: () => console.log("TBD") },
    { label: "GitHub", onClick: () => console.log("TBD") },
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
      <Dialog aria-label="test">TBD</Dialog>
    </>
  );
}
