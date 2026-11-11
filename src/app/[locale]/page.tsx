import About from "@components/about/About";
import Projects from "@components/projects/Projects";
import Skills from "@components/skills/Skills";
import Experience from "@components/experience/Experience";
import Loader from "@ui/loader/Loader";
import Dialog from "@ui/dialog/Dialog";
import ModalContextComponent from "@ui/modalContext/ModalContext";
import Aside from "@components/contact/Aside";
import styles from "./page.module.css";

// TODO: Refactor Modal/Aside to be more global. Possibly with createportal.

export default function Home() {
  return (
    <main className={styles.main}>
      <Loader />
      <ModalContextComponent>
        <About />
        <Skills />
        <Projects />
        <Experience />
        <Aside />
        <Dialog />
      </ModalContextComponent>
    </main>
  );
}
