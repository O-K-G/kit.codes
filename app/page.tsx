import styles from "./page.module.css";
import Hero from "@components/hero/hero";
import About from "@components/about/about";
import Experience from "@components/experience/experience";
import WhyMe from "@components/whyMe/whyMe";
import Skills from "@components/skills/skills";
import Rooftop from "@components/rooftop/rooftop";
import Footer from "@components/footer/footer";
import { MAIN_CONTENT_ID } from "@ui/skipLink/skipLink.constants";

export default function Home() {
  
  return (
    <main id={MAIN_CONTENT_ID} className={styles.mainContent}>
      <Hero />
      <About />
      <Experience />
      <WhyMe />
      <Skills />
      <Rooftop />
      <Footer />
    </main>
  );
}
