import RadioTowerIcon from "@ui/iconComponents/radioTowerIcon/radioTowerIcon";
import styles from "./sendingAlert.module.css";

const SENDING_LABEL = "Sending...";

export default function SendingAlert() {
  return (
    <span className={styles.alert}>
      <RadioTowerIcon aria-hidden  /> {SENDING_LABEL}
    </span>
  );
}
