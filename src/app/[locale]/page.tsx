import About from "@components/byPage/About";
import Projects from "@components/byPage/Projects";
import Skills from "@components/byPage/Skills";
import Experience from "@components/byPage/Experience";
import Loader from "@components/shared/Loader";
import Dialog from "@components/shared/dialog/Dialog";
import ModalContextComponent from "@components/shared/ModalContext";
import Aside from "@components/shared/Aside";
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
