import Section from "@components/shared/Section";
import ExpandableButton from "@components/shared/expandableButton/ExpandableButton";
import Title from "@components/shared/title/Title";
import { useTranslations } from "next-intl";
import styles from "./About.module.css";

const CURRENT_SECTION = "about";

export default function About() {
  const t = useTranslations("about");

  return (
    <Section
      className={styles.section}
      currentSection={CURRENT_SECTION}
    >
      <header className={styles.header}>
        <Title
          component="h1"
          border
          topLabel={t("topLabel")}
          bottomLabel={t("bottomLabel")}
          isRightLabelBlink
        >
          {t("mainTitle")}
        </Title>
      </header>

      <Title isDelayedAnimation>
        {t("subtitle")}
      </Title>

      <ExpandableButton alternativeLabel={t("alternativeLabel")} />
    </Section>
  );
}
