import Section from "@components/shared/Section";
import ContactForm from "@components/contactForm/ContactForm";
import { useTranslations } from "next-intl";
import SideLinks from "@components/shared/SideLinks";
import { ContactProps } from "@constants/interfaces";
import ContactGoBackButton from "@components/shared/ContactGoBackButton";
import Title from "@components/shared/title/Title";
import SectionBackground from "@components/shared/SectionBackground";
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
