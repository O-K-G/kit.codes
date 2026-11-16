import { ActiveSectionProps } from "@constants/interfaces";
import { REVIEW_QUOTES } from "@constants/reviews";
import Section from "@ui/section/Section";
import { useLocale, useTranslations } from "next-intl";
import { URLs } from "@constants/urls";
import Title from "@ui/title/Title";
import Footer from "@components/reviews/Footer";
import SatelliteDish from "@components/reviews/SatelliteDish";
import ReviewsTypewriter from "@components/reviews/ReviewsTypewriter";
import styles from "./Reviews.module.css";

const CURRENT_SECTION = "reviews";

/** The quotes, each in quotation marks (typed with it) */
const QUOTES = Object.values(REVIEW_QUOTES).map((quote) => `“${quote}”`);

/** Quotes from reviews of my work (see REVIEW_QUOTES), typed out in a box, a transmitting satellite dish
 * under them; then the page's footer */
export default function Reviews({ activeSection }: ActiveSectionProps) {
  const t = useTranslations("reviews");
  const locale = useLocale();

  return (
    <Section className={styles.section} currentSection={CURRENT_SECTION} activeSection={activeSection}>
      <Title border>{t("mainTitle")}</Title>
      <div className={styles.content}>
        <ReviewsTypewriter
          quotes={QUOTES}
          label={t("mainTitle")}
          className={styles.typewriter}
          below={<SatelliteDish className={styles.dish} />}
          source={
            <span lang="en">
              SRC:{" "}
              <a href={URLs.linkedIn} target="_blank" rel="noreferrer" className={styles.sourceLink}>
                LinkedIn
                <span lang={locale} className="sr-only">
                  {" "}
                  {t("opensInNewTab")}
                </span>
              </a>
            </span>
          }
        />
      </div>
      <Footer />
    </Section>
  );
}
