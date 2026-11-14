import { ActiveSectionProps } from "@constants/interfaces";
import Section from "@ui/section/Section";
import { useTranslations } from "next-intl";
import SkillBars from "@components/skills/SkillBars";
import SideLinks from "@ui/sideLinks/SideLinks";
import Title from "@ui/title/Title";
import styles from "./Skills.module.css";

const CURRENT_SECTION = "skills";

export default function Skills({ activeSection }: ActiveSectionProps) {
  const t = useTranslations("skills");

  return (
    <Section
      className={styles.section}
      currentSection={CURRENT_SECTION}
      activeSection={activeSection}
    >
      <Title
        className={`${styles.slideIn} ${styles.mainTitle}`}
        border
      >
        {t("mainTitle")}
      </Title>
      <Title
        className={`${styles.slideIn} ${styles.subtitle}`}
        variant="subtitle"
      >
        {t("subtitle")}
      </Title>
      <SkillBars className={`${styles.slideIn} ${styles.skillBars}`} />

      <SideLinks />
    </Section>
  );
}
