import { ActiveSectionProps } from "@constants/interfaces";
import Section from "@ui/section/Section";
import { useTranslations } from "next-intl";
import ScrollableSubsection from "@ui/scrollableSection/ScrollableSubsection";
import ExpandableContent from "@ui/expandableContent/ExpandableContent";
import Title from "@ui/title/Title";
import Footer from "@components/projects/Footer";

const CURRENT_SECTION = "projects";

export default function Projects({ activeSection }: ActiveSectionProps) {
  const t = useTranslations("projects");

  return (
    <Section currentSection={CURRENT_SECTION} activeSection={activeSection}>
      <Title border>{t("mainTitle")}</Title>
      <ScrollableSubsection aria-label={t("mainTitle")}>
            <ScrollableSubsection.Item>
          <Title variant="subtitle" component="h3">{t("volteraMainTitle")}</Title>
          <ExpandableContent text={t("volteraDescription")} />
        </ScrollableSubsection.Item>
        <ScrollableSubsection.Item>
          <Title variant="subtitle" component="h3">{t("faiMainTitle")}</Title>
          <ExpandableContent text={t("faiDescription")} />
        </ScrollableSubsection.Item>

        <ScrollableSubsection.Item>
          <Title variant="subtitle" component="h3">{t("bankMainTitle")}</Title>
          <ExpandableContent text={t("bankMainTitleDescription")} />
        </ScrollableSubsection.Item>

        <ScrollableSubsection.Item>
          <Title variant="subtitle" component="h3">{t("faiMainTitle2")}</Title>
          <ExpandableContent text={t("faiDescription2")} />
        </ScrollableSubsection.Item>
      </ScrollableSubsection>
      <Footer />
    </Section>
  );
}
