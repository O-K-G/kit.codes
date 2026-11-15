import ScrollIconComponent from "@components/projects/ScrollIconComponent";
import Attribution from "@components/projects/Attribution";
import Shenanigans from "@components/projects/Shenanigans";
import Planet from "@components/projects/Planet";
import ScrollToTopComponent from "@components/projects/ScrollToTopComponent";
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
