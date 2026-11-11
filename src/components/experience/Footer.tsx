import ScrollIconComponent from "@components/experience/ScrollIconComponent";
import Attribution from "@components/experience/Attribution";
import Shenanigans from "@components/experience/Shenanigans";
import Planet from "@components/experience/Planet";
import ScrollToTopComponent from "@components/experience/ScrollToTopComponent";
import styles from "./Footer.module.css";

export default function Footer() {
  return (
    <footer className={styles.footer}>
      <Planet />
      <ScrollIconComponent />
      <ScrollToTopComponent />
      <Attribution />
      <Shenanigans />
    </footer>
  );
}
