import styles from "./footer.module.css";
import Typography from "@ui/typography/typography";
import { LABEL } from "./footer.constants";

export default function Footer() {
  return (
    <Typography
      className={styles.footerText}
      component="footer"
      color="mist"
      variant="footer"
    >
      {LABEL}
    </Typography>
  );
}
