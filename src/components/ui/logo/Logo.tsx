import { URLs } from "@constants/urls";
import contactMeStyles from "@components/contact/ContactGoBackButton.module.css";
import styles from "./Logo.module.css";

/** The site's name, which the logo reads */
export const LOGO_TEXT = "kit.codes";

/**
 * The site's logo: its name, linking to the site's home page. It shares the "Contact me" button's
 * font and style (see ContactGoBackButton), across from it at the top of the screen.
 *
 * Accessibility: the visible text is the link's name (WCAG 2.5.3). It's marked as English, as it's
 * set in the English font on every page.
 */
export default function Logo() {
  return (
    <a
      href={URLs.siteURL}
      lang="en"
      className={`${contactMeStyles.button} ${styles.logo}`}
    >
      {LOGO_TEXT}
    </a>
  );
}
