"use client";

import styles from "./rooftop.module.css";
import ContentSection from "@components/contentSection/contentSection";
import Button from "@ui/button/button";
import Typography from "@ui/typography/typography";
import { SECTION_IDS } from "@/app/page.constants";
import Dialog from "@ui/dialog/dialog";
import MessageForm from "../hero/messageForm";
import { DIALOG_ARIA_LABEL } from "../hero/heroButtons.constants";
import { useState } from "react";
import {
  BUTTONS,
  BUZZER_LABEL,
  EMAIL_BUTTON_LABEL,
  EYEBROW,
  PARAGRAPH,
  TITLE,
} from "./rooftop.constants";

export default function Rooftop() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <ContentSection
        id={SECTION_IDS.rooftop}
        bottomBorder={false}
        eyebrow={EYEBROW}
        title={TITLE}
        paragraph={PARAGRAPH}
        slot={
          <div className={styles.rooftop}>
            <Typography component="p" color="mist" variant="intercom-head">
              {BUZZER_LABEL}
            </Typography>

            <div className={styles.buttonsContainer}>
              <Button
                variant="buzzer"
                type="button"
                onClick={() => setOpen(true)}
              >
                {EMAIL_BUTTON_LABEL}
              </Button>
              {BUTTONS.map(({ label, ...rest }) => (
                <Button
                  key={`buzzer-${label}`}
                  variant="buzzer"
                  type="button"
                  {...rest}
                >
                  {label}
                </Button>
              ))}
            </div>
          </div>
        }
      />
      <Dialog
        open={open}
        aria-label={DIALOG_ARIA_LABEL}
        onClose={() => setOpen(false)}
      >
        <MessageForm onClick={() => setOpen(false)} />
      </Dialog>
    </>
  );
}
