import TopCardBar from "@ui/topCardBar/topCardBar";
import styles from "./skills.module.css";
import ContentSection from "@components/contentSection/contentSection";
import Badge from "@ui/badge/badge";
import Typography from "@ui/typography/typography";
import { SECTION_IDS } from "@/app/page.constants";
import {
  ADDITIONAL_DETAILS_LABEL,
  ADDITIONAL_SKILLS,
  EYEBROW,
  SKILLS,
  TITLE,
  TOP_BAR,
  YEARS_LABEL,
} from "./skills.constants";
import ProgressBar from "@/app/ui/progressBar/progressBar";

export default function Skills() {
  return (
    <ContentSection
      id={SECTION_IDS.skills}
      eyebrow={EYEBROW}
      title={TITLE}
      slot={
        <div className={styles.panel}>
          <div className={styles.content}>
            <TopCardBar
              leftSlotColor="window"
              leftSlot={TOP_BAR.leftSlot}
              className={styles.topBar}
              rightSlot={
                <Badge
                  rotate="right"
                  borderColor="block-border"
                  color="mist"
                  label={TOP_BAR.rightSlot}
                  badgeBorder="pill"
                />
              }
            />

            <ul className={styles.barsContainer}>
              {SKILLS.map(({ skill, proficiency, years }) => {
                const id = `skill-bar-${skill}`;
                const yearsLabel = `${years} ${YEARS_LABEL}`;

                return (
                  <ProgressBar
                    key={id}
                    id={id}
                    startLabel={skill}
                    value={proficiency}
                    endLabel={yearsLabel}
                  />
                );
              })}
            </ul>

            <Typography component="p" color="mist" variant="cert-also">
              {ADDITIONAL_DETAILS_LABEL}&nbsp;
              <strong>{ADDITIONAL_SKILLS}</strong>
            </Typography>
          </div>
        </div>
      }
    />
  );
}
