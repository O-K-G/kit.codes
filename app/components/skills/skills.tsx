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
  YEARS_LABEL,
} from "./skills.constants";

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
              leftSlot={"Proficient in"}
              className={styles.topBar}
              rightSlot={
                <Badge
                  rotate="right"
                  borderColor="block-border"
                  color="mist"
                  label={"Issued 2026"}
                  badgeBorder="pill"
                />
              }
            />

            <ul className={styles.barsContainer}>
              {SKILLS.map(({ skill, proficiency, years }) => {
                const id = `skill-bar-${skill}`;
                const yearsLabel = `${years} ${YEARS_LABEL}`;

                return (
                  <li key={id}>
                    <Typography
                      component="label"
                      htmlFor={id}
                      color="paper"
                      variant="skill-label"
                    >
                      {skill}
                    </Typography>

                    <progress id={id} max={100} value={proficiency}>
                      {proficiency}
                    </progress>

                    <Typography
                      className="span"
                      color="mist"
                      variant="skill-label"
                    >
                      {yearsLabel}
                    </Typography>
                  </li>
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
