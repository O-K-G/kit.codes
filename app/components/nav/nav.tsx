import typographyStyles from "@ui/typography/typography.module.css";
import styles from "./nav.module.css";
import Link from "next/link";

const LOGO = {
  label: "kit.codes",
  ariaLabel: "Homepage",
};

export default function Nav() {
  return (
    <nav className={styles.navigation}>
      <header>
        <Link
          className={typographyStyles.typography}
          data-variant="nav-logo"
          aria-label={LOGO.ariaLabel}
          href="#"
        >
          {LOGO.label}
        </Link>
      </header>

      <ul>
        {[
          { label: "G" },
          { label: "1" },
          { label: "2" },
          { label: "3", selected: true },
          { label: "4" },
          { label: "R" },
        ].map(({ label, selected }) => (
          <li data-selected={selected} key={`nav-${label}}`}>
            <Link
              className={typographyStyles.typography}
              data-variant="floor-btn"
              href="#"
            >
              {label}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}
