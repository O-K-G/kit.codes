import ScrollIconComponent from "@components/reviews/ScrollIconComponent";
import Attribution from "@components/reviews/Attribution";
import Shenanigans from "@components/reviews/Shenanigans";
import Planet from "@components/reviews/Planet";
import ScrollToTopComponent from "@components/reviews/ScrollToTopComponent";
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
