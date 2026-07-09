import TopCardBar from "@ui/topCardBar/topCardBar";
import styles from "./skills.module.css";
import ContentSection from "@components/contentSection/contentSection";
import Badge from "@ui/badge/badge";

const EYEBROW = "4 · Skills";
const TITLE = "Certificate of skill";

export default function Skills() {
  return (
    <ContentSection
      eyebrow={EYEBROW}
      title={TITLE}
      slot={
        <div className={styles.panel}>
          <div className={styles.content}>
            <TopCardBar
              leftSlotColor="window"
              leftSlot={"Proficient in"}
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
          </div>
        </div>
      }
    />
  );
}
