import styles from "./rooftop.module.css";
import ContentSection from "@components/contentSection/contentSection";
import Button from "@ui/button/button";
import Typography from "@/app/ui/typography/typography";
import { SECTION_IDS } from "@/app/page.constants";
import {
  BUTTONS,
  BUZZER_LABEL,
  EYEBROW,
  PARAGRAPH,
  TITLE,
} from "./rooftop.constants";

export default function Rooftop() {
  return (
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
            {BUTTONS.map(({ label }) => (
              <Button variant="buzzer" key={`buzzer-${label}`} type="button">
                {label}
              </Button>
            ))}
          </div>
        </div>
      }
    />
  );
}
