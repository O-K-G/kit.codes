import Section from "@ui/section/Section";
import { useTranslations } from "next-intl";
import ScrollableSubsection from "@ui/scrollableSection/ScrollableSubsection";
import ExpandableButton from "@ui/expandableButton/ExpandableButton";
import Title from "@ui/title/Title";
import Footer from "@components/experience/Footer";

const CURRENT_SECTION = "experience";

export default function Experience() {
  const t = useTranslations("experience");

  return (
    <Section currentSection={CURRENT_SECTION}>
      <Title border>{t("mainTitle")}</Title>
      <ScrollableSubsection>
            <ScrollableSubsection.Item>
          <Title variant="subtitle">{t("volteraMainTitle")}</Title>
          <ExpandableButton alternativeLabel={t("volteraDescription")} />
        </ScrollableSubsection.Item>
        <ScrollableSubsection.Item>
          <Title variant="subtitle">{t("faiMainTitle")}</Title>
          <ExpandableButton alternativeLabel={t("faiDescription")} />
        </ScrollableSubsection.Item>

        <ScrollableSubsection.Item>
          <Title variant="subtitle">{t("bankMainTitle")}</Title>
          <ExpandableButton alternativeLabel={t("bankMainTitleDescription")} />
        </ScrollableSubsection.Item>

        <ScrollableSubsection.Item>
          <Title variant="subtitle">{t("faiMainTitle2")}</Title>
          <ExpandableButton alternativeLabel={t("faiDescription2")} />
        </ScrollableSubsection.Item>
      </ScrollableSubsection>
      <Footer />
    </Section>
  );
}
