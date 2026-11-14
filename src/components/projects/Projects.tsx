import { ActiveSectionProps } from "@constants/interfaces";
import Section from "@ui/section/Section";
import { useTranslations } from "next-intl";
import ScrollableSubsection from "@ui/scrollableSection/ScrollableSubsection";
import ExpandableContent from "@ui/expandableContent/ExpandableContent";
import Title from "@ui/title/Title";

const CURRENT_SECTION = "projects";

export default function Projects({ activeSection }: ActiveSectionProps) {
  const t = useTranslations("projects");

  return (
    <Section currentSection={CURRENT_SECTION} activeSection={activeSection}>
      <Title border>{t("mainTitle")}</Title>
      <ScrollableSubsection aria-label={t("mainTitle")}>
        <ScrollableSubsection.Item>
          <Title variant="subtitle" component="h3">{t("dragAndDropTitle")}</Title>
          <ExpandableContent text={t("dragAndDropDescription")} />
        </ScrollableSubsection.Item>

        <ScrollableSubsection.Item>
          <Title variant="subtitle" component="h3">{t("thisLandingPageTitle")}</Title>
          <ExpandableContent
            text={t("thisLandingPageDescription")}
          />
        </ScrollableSubsection.Item>

        <ScrollableSubsection.Item>
          <Title variant="subtitle" component="h3">{t("onboardingTitle")}</Title>
          <ExpandableContent text={t("onboardingDescription")} />
        </ScrollableSubsection.Item>

        <ScrollableSubsection.Item>
          <Title variant="subtitle" component="h3">{t("sharedUITitle")}</Title>
          <ExpandableContent text={t("sharedUIDescription")} />
        </ScrollableSubsection.Item>

        <ScrollableSubsection.Item>
          <Title variant="subtitle" component="h3">{t("i18nCoordinatorTitle")}</Title>
          <ExpandableContent
            text={t("i18nCoordinatorDescription")}
          />
        </ScrollableSubsection.Item>

        <ScrollableSubsection.Item>
          <Title variant="subtitle" component="h3">{t("scrumMaster")}</Title>
          <ExpandableContent text={t("scrumMasterDescription")} />
        </ScrollableSubsection.Item>
      </ScrollableSubsection>
    </Section>
  );
}
