import { URLs } from "@constants/urls";
import styles from "./Logo.module.css";

/** The site's name, which the logo reads */
export const LOGO_TEXT = "kit.codes";

/**
 * The site's logo: its name, linking to the site's home page. The "Contact me" button, across from it
 * at the top of the screen, shares its look (see Logo.module.css).
 *
 * Accessibility: the visible text is the link's name (WCAG 2.5.3). It's marked as English, as it's
 * set in the English font on every page.
 */
export default function Logo() {
  return (
    <a
      href={URLs.siteURL}
      lang="en"
      className={styles.logo}
    >
      {LOGO_TEXT}
    </a>
  );
}
