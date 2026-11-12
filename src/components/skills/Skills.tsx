import { ActiveSectionProps } from "@constants/interfaces";
import Section from "@ui/section/Section";
import { useTranslations } from "next-intl";
import SkillsList from "@components/skills/SkillsList";
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
        className={`${styles.title} ${styles.mainTitle}`}
        border
      >
        {t("mainTitle")}
      </Title>
      <Title
        className={`${styles.title} ${styles.subtitle}`}
        variant="subtitle"
      >
        {t("subtitle")}
      </Title>
      <SkillsList />

      <SideLinks />
    </Section>
  );
}
