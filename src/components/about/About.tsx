import { ActiveSectionProps } from "@constants/interfaces";
import Section from "@ui/section/Section";
import ExpandableContent from "@ui/expandableContent/ExpandableContent";
import Title from "@ui/title/Title";
import { useTranslations } from "next-intl";
import styles from "./About.module.css";

const CURRENT_SECTION = "about";

export default function About({ activeSection }: ActiveSectionProps) {
  const t = useTranslations("about");

  return (
    <Section
      className={styles.section}
      currentSection={CURRENT_SECTION}
      activeSection={activeSection}
    >
      <header>
        <Title
          component="h1"
          className={styles.title}
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

      <ExpandableContent className={styles.text} text={t("alternativeLabel")} />
    </Section>
  );
}
