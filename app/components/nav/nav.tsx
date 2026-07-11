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
        {NAV_LINKS.map(({ label, selected }) => (
          <li data-selected={selected} key={`nav-${label}}`}>
            <NavLink label={label} />
          </li>
        ))}
      </ul>
    </nav>
  );
}
