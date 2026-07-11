import typographyStyles from "@ui/typography/typography.module.css";
import styles from "./nav.module.css";
import Link from "next/link";
import { LOGO, NAV_LINKS } from "./nav.constants";
import NavLink from "./navLink";

export default function Nav() {
  return (
    <nav className={styles.navigation}>
      <header>
        <Link
          className={typographyStyles.typography}
          data-variant="nav-logo"
          aria-label={LOGO.ariaLabel}
          href="/"
        >
          {LOGO.label}
        </Link>
      </header>

      <ul>
        {NAV_LINKS.map(({ id, label }) => (
          <li
            data-selection-id={id}
            data-is-in-view="false"
            key={`nav-${label}}`}
          >
            <NavLink id={id} label={label} />
          </li>
        ))}
      </ul>
    </nav>
  );
}
