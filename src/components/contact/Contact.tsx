import Section from "@ui/section/Section";
import ContactForm from "@components/contact/ContactForm";
import { useTranslations } from "next-intl";
import SideLinks from "@ui/sideLinks/SideLinks";
import AsideOpenContent from "@components/contact/AsideOpenContent";
import ContactCloseButton from "@components/contact/ContactCloseButton";
import Title from "@ui/title/Title";
import SectionBackground from "@ui/sectionBackground/SectionBackground";
import styles from "./Contact.module.css";

const CURRENT_SECTION = "contact";

export default function Contact() {
  const t = useTranslations("contact");

  return (
    <Section className={styles.section}>
      <SectionBackground
        minHeightClassName={styles.background}
        currentSection={CURRENT_SECTION}
      />
      <AsideOpenContent>
        <ContactCloseButton className={styles.goBackButton}>
          {t("goBack")}
        </ContactCloseButton>
        <Title border>{t("mainTitle")}</Title>
        <ContactForm />
        <SideLinks
          hideChangeLanguageButton
          className={styles.sideLinks}
          ulClassName={styles.sideLinksList}
        />
      </AsideOpenContent>
    </Section>
  );
}
