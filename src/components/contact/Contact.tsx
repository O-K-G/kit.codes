import Section from "@ui/section/Section";
import ContactForm from "@components/contact/ContactForm";
import { useTranslations } from "next-intl";
import SideLinks from "@ui/sideLinks/SideLinks";
import { ContactProps } from "@constants/interfaces";
import ContactGoBackButton from "@components/contact/ContactGoBackButton";
import Title from "@ui/title/Title";
import SectionBackground from "@ui/sectionBackground/SectionBackground";
import styles from "./Contact.module.css";

const CURRENT_SECTION = "contact";

export default function Contact({ onClick, open }: ContactProps) {
  const t = useTranslations("contact");

  return (
    <Section className={styles.section}>
      <SectionBackground
        minHeightClassName={styles.background}
        currentSection={CURRENT_SECTION}
      />
      {open && (
        <>
          <ContactGoBackButton
            onClick={onClick}
            className={styles.goBackButton}
          >
            {t("goBack")}
          </ContactGoBackButton>
          <Title border>{t("mainTitle")}</Title>
          <ContactForm />
          <SideLinks
            hideChangeLanguageButton
            className={styles.sideLinks}
            ulClassName={styles.sideLinksList}
          />
        </>
      )}
    </Section>
  );
}
