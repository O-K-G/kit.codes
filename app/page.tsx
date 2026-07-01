import Hero from "@components/hero/hero";
import styles from "./page.module.css";

 /** TODO: banner. */

 
export default function Home() {
  return (
    <main className={styles.mainContent}>
      <Hero />
    </main>
  );
}
