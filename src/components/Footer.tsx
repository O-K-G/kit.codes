import ScrollIconComponent from "@components/shared/ScrollIconComponent";
import Attribution from "@components/Attribution";
import Shenanigans from "@components/Shenanigans";
import Planet from "@components/shared/Planet";
import ScrollToTopComponent from "@components/shared/ScrollToTopComponent";
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
