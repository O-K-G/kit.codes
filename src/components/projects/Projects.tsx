import { ActiveSectionProps } from "@constants/interfaces";
import Section from "@ui/section/Section";
import { useTranslations } from "next-intl";
import ScrollableSubsection from "@ui/scrollableSection/ScrollableSubsection";
import ExpandableButton from "@ui/expandableButton/ExpandableButton";
import Title from "@ui/title/Title";

const CURRENT_SECTION = "projects";

export default function Projects({ activeSection }: ActiveSectionProps) {
  const t = useTranslations("projects");

  return (
    <Section currentSection={CURRENT_SECTION} activeSection={activeSection}>
      <Title border>{t("mainTitle")}</Title>
      <ScrollableSubsection>
        <ScrollableSubsection.Item>
          <Title variant="subtitle">{t("dragAndDropTitle")}</Title>
          <ExpandableButton alternativeLabel={t("dragAndDropDescription")} />
        </ScrollableSubsection.Item>

        <ScrollableSubsection.Item>
          <Title variant="subtitle">{t("thisLandingPageTitle")}</Title>
          <ExpandableButton
            alternativeLabel={t("thisLandingPageDescription")}
          />
        </ScrollableSubsection.Item>

        <ScrollableSubsection.Item>
          <Title variant="subtitle">{t("onboardingTitle")}</Title>
          <ExpandableButton alternativeLabel={t("onboardingDescription")} />
        </ScrollableSubsection.Item>

        <ScrollableSubsection.Item>
          <Title variant="subtitle">{t("sharedUITitle")}</Title>
          <ExpandableButton alternativeLabel={t("sharedUIDescription")} />
        </ScrollableSubsection.Item>

        <ScrollableSubsection.Item>
          <Title variant="subtitle">{t("i18nCoordinatorTitle")}</Title>
          <ExpandableButton
            alternativeLabel={t("i18nCoordinatorDescription")}
          />
        </ScrollableSubsection.Item>

        <ScrollableSubsection.Item>
          <Title variant="subtitle">{t("scrumMaster")}</Title>
          <ExpandableButton alternativeLabel={t("scrumMasterDescription")} />
        </ScrollableSubsection.Item>
      </ScrollableSubsection>
    </Section>
  );
}
