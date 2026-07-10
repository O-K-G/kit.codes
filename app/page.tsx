import styles from "./page.module.css";
import Hero from "@components/hero/hero";
import About from "@components/about/about";
import Experience from "@components/experience/experience";
import Projects from "@components/projects/projects";
import Skills from "@components/skills/skills";
import Rooftop from "@components/rooftop/rooftop";
import Footer from "@components/footer/footer";

export default function Home() {
  return (
    <main className={styles.mainContent}>
      <Hero />
      <About />
      <Experience />
      <Projects />
      <Skills />
      <Rooftop />
      <Footer />
    </main>
  );
}
