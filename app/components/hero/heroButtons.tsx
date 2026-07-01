"use client";

import Button from "@ui/button/button";
import styles from "./heroButtons.module.css";

const BUTTONS = [
  { label: "Email me", variant: 'fill-sky-deep', onClick: () => console.log("TBD") },
  { label: "Download Résumé", onClick: () => console.log("TBD") },
  { label: "GitHub", onClick: () => console.log("TBD") },
] as const;

export default function HeroButtons() {
  return (
    <div className={styles.heroButtons}>
      {BUTTONS.map(({ label, ...rest }) => (
        <Button key={label} {...rest}>
          {label}
        </Button>
      ))}
    </div>
  );
}
