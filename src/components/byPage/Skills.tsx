import Section from "@components/shared/Section";
import { useTranslations } from "next-intl";
import SkillsList from "@components/SkillsList";
import SideLinks from "@components/shared/SideLinks";
import Title from "@components/shared/title/Title";
import styles from "./Skills.module.css";

const CURRENT_SECTION = "skills";

export default function Skills() {
  const t = useTranslations("skills");

  return (
    <Section
      className={styles.section}
      currentSection={CURRENT_SECTION}
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
