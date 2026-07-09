import Hero from "@components/hero/hero";
import styles from "./page.module.css";
import About from "@components/about/about";
import Experience from "@components/experience/experience";
import Projects from "@components/projects/projects";
import Skills from "@components/skills/skills";

export default function Home() {
  return (
    <main className={styles.mainContent}>
      <Hero />
      <About />
      <Experience />
      <Projects />
      <Skills />
    </main>
  );
}
