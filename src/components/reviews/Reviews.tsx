import { ActiveSectionProps } from "@constants/interfaces";
import { REVIEW_QUOTES } from "@constants/reviews";
import Section from "@ui/section/Section";
import { useTranslations } from "next-intl";
import Title from "@ui/title/Title";
import Footer from "@components/reviews/Footer";
import SatelliteDish from "@components/reviews/SatelliteDish";
import ReviewsTypewriter from "@components/reviews/ReviewsTypewriter";
import styles from "./Reviews.module.css";

const CURRENT_SECTION = "reviews";

/** Quotes from reviews of my work (see REVIEW_QUOTES), typed out beside a transmitting satellite dish;
 * then the page's footer */
export default function Reviews({ activeSection }: ActiveSectionProps) {
  const t = useTranslations("reviews");

  return (
    <Section className={styles.section} currentSection={CURRENT_SECTION} activeSection={activeSection}>
      <Title border>{t("mainTitle")}</Title>
      {/* Left to right on every locale's page: the dish transmits toward the quotes */}
      <div dir="ltr" className={styles.content}>
        <SatelliteDish className={styles.dish} />
        <ReviewsTypewriter quotes={Object.values(REVIEW_QUOTES)} label={t("mainTitle")} />
      </div>
      <Footer />
    </Section>
  );
}
