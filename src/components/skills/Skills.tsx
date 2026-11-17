import { ActiveSectionProps } from "@constants/interfaces";
import Section from "@ui/section/Section";
import { useTranslations } from "next-intl";
import SkillBars from "@components/skills/SkillBars";
import SideLinks from "@ui/sideLinks/SideLinks";
import Title from "@ui/title/Title";
import styles from "./Skills.module.css";
import classNames from "@utils/classNames";

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
        className={classNames(styles.slideIn, styles.mainTitle)}
        border
      >
        {t("mainTitle")}
      </Title>
      <Title
        className={classNames(styles.slideIn, styles.subtitle)}
        variant="subtitle"
        component="p"
      >
        {t("subtitle")}
      </Title>
      <SkillBars
        className={classNames(styles.slideIn, styles.skillBars)}
        groupNames={{
          frontEnd: t("groups.frontEnd"),
          backEnd: t("groups.backEnd"),
          databases: t("groups.databases"),
          general: t("groups.general"),
        }}
      />

      <SideLinks />
    </Section>
  );
}
