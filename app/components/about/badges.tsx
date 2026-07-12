import { ABOUT_BADGES } from "./about.constants";
import styles from "./badges.module.css";
import Badge from "@ui/badge/badge";

export default function Badges() {
  return (
    <div className={styles.badgesCOntainer}>
      {ABOUT_BADGES.map((label) => (
        <Badge
          key={`badges-${label}`}
          badgeBorder="pill"
          color="mist"
          borderColor="block-border"
          label={label}
        />
      ))}
    </div>
  );
}
