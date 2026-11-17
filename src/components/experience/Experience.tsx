import { ActiveSectionProps } from "@constants/interfaces";
import { EXPERIENCE_TIMELINE } from "@constants/experience";
import Section from "@ui/section/Section";
import { useTranslations } from "next-intl";
import Title from "@ui/title/Title";
import Timeline from "@ui/timeline/Timeline";
import styles from "./Experience.module.css";

const CURRENT_SECTION = "experience";

export default function Experience({ activeSection }: ActiveSectionProps) {
  const t = useTranslations("experience");

  return (
    <Section className={styles.section} currentSection={CURRENT_SECTION} activeSection={activeSection}>
      <Title border>{t("mainTitle")}</Title>
      <Timeline
        aria-label={t("mainTitle")}
        items={EXPERIENCE_TIMELINE.map(({ year, titleKey, textKey, Icon }) => ({
          year,
          title: t(titleKey),
          text: t(textKey),
          icon: <Icon />,
        }))}
      />
    </Section>
  );
}
