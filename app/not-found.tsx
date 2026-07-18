import { LABEL } from "./not-found.constants";
import styles from "./not-found.module.css";
import Typography from "@ui/typography/typography";

export default function NotFound() {
  return (
    <div className={styles.notFound}>
      <Typography component="h2" color="paper" variant="project-heading">
        {LABEL}
      </Typography>
    </div>
  );
}
