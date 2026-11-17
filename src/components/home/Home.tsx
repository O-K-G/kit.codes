import About from "@components/about/About";
import Reviews from "@components/reviews/Reviews";
import Skills from "@components/skills/Skills";
import Experience from "@components/experience/Experience";
import Loader from "@ui/loader/Loader";
import Aside from "@components/contact/Aside";
import Logo from "@ui/logo/Logo";
import { ActiveSectionProps } from "@constants/interfaces";
import styles from "./Home.module.css";

export default function Home({ activeSection = "about" }: ActiveSectionProps) {
  return (
    <>
      <header>
        <Logo />
      </header>
      <main className={styles.main}>
        <Loader />
        <About activeSection={activeSection} />
        <Skills activeSection={activeSection} />
        <Experience activeSection={activeSection} />
        <Reviews activeSection={activeSection} />
        <Aside activeSection={activeSection} />
      </main>
    </>
  );
}
