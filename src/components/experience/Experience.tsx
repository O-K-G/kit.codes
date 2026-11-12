import { ActiveSectionProps } from "@constants/interfaces";
import Section from "@ui/section/Section";
import { useTranslations } from "next-intl";
import ScrollableSubsection from "@ui/scrollableSection/ScrollableSubsection";
import ExpandableContent from "@ui/expandableContent/ExpandableContent";
import Title from "@ui/title/Title";
import Footer from "@components/experience/Footer";

const CURRENT_SECTION = "experience";

export default function Experience({ activeSection }: ActiveSectionProps) {
  const t = useTranslations("experience");

  return (
    <Section currentSection={CURRENT_SECTION} activeSection={activeSection}>
      <Title border>{t("mainTitle")}</Title>
      <ScrollableSubsection>
            <ScrollableSubsection.Item>
          <Title variant="subtitle">{t("volteraMainTitle")}</Title>
          <ExpandableContent text={t("volteraDescription")} />
        </ScrollableSubsection.Item>
        <ScrollableSubsection.Item>
          <Title variant="subtitle">{t("faiMainTitle")}</Title>
          <ExpandableContent text={t("faiDescription")} />
        </ScrollableSubsection.Item>

        <ScrollableSubsection.Item>
          <Title variant="subtitle">{t("bankMainTitle")}</Title>
          <ExpandableContent text={t("bankMainTitleDescription")} />
        </ScrollableSubsection.Item>

        <ScrollableSubsection.Item>
          <Title variant="subtitle">{t("faiMainTitle2")}</Title>
          <ExpandableContent text={t("faiDescription2")} />
        </ScrollableSubsection.Item>
      </ScrollableSubsection>
      <Footer />
    </Section>
  );
}
