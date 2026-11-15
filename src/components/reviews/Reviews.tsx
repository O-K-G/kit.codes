import { ActiveSectionProps } from "@constants/interfaces";
import { REVIEW_QUOTES } from "@constants/reviews";
import Section from "@ui/section/Section";
import { useTranslations } from "next-intl";
import Title from "@ui/title/Title";
import Footer from "@components/reviews/Footer";
import styles from "./Reviews.module.css";

const CURRENT_SECTION = "reviews";

/** Quotes from reviews of my work (see REVIEW_QUOTES), then the page's footer */
export default function Reviews({ activeSection }: ActiveSectionProps) {
  const t = useTranslations("reviews");

  return (
    <Section className={styles.section} currentSection={CURRENT_SECTION} activeSection={activeSection}>
      <Title border>{t("mainTitle")}</Title>
      {/* The quotes are in English on every locale's page */}
      <ul aria-label={t("mainTitle")} lang="en" dir="ltr" className={styles.quotes}>
        {Object.entries(REVIEW_QUOTES).map(([key, quote]) => (
          <li key={key} className={styles.quote}>
            <blockquote>
              <p>{quote}</p>
            </blockquote>
          </li>
        ))}
      </ul>
      <Footer />
    </Section>
  );
}
