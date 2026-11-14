import About from "@components/about/About";
import Projects from "@components/projects/Projects";
import Skills from "@components/skills/Skills";
import Experience from "@components/experience/Experience";
import Loader from "@ui/loader/Loader";
import Dialog from "@ui/dialog/Dialog";
import ModalContextComponent from "@ui/modalContext/ModalContext";
import Aside from "@components/contact/Aside";
import Logo from "@ui/logo/Logo";
import { ActiveSectionProps } from "@constants/interfaces";
import styles from "./Home.module.css";

// TODO: Refactor Modal/Aside to be more global. Possibly with createportal.

export default function Home({ activeSection = "about" }: ActiveSectionProps) {
  return (
    <>
      <header>
        <Logo />
      </header>
      <main className={styles.main}>
        <Loader />
        <ModalContextComponent>
          <About activeSection={activeSection} />
          <Skills activeSection={activeSection} />
          <Projects activeSection={activeSection} />
          <Experience activeSection={activeSection} />
          <Aside activeSection={activeSection} />
          <Dialog />
        </ModalContextComponent>
      </main>
    </>
  );
}
