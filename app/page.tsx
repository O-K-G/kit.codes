import Hero from "@components/hero/hero";
import styles from "./page.module.css";
import About from "@components/about/about";
import Experience from "@components/experience/experience";
// import { sendEmail } from "./utils/sendEmail";

export default function Home() {

  // TODO
 //  sendEmail({from: 'test', subject: 'test1', text: 'xxx'}).then((x) => console.log(x))
 // Email form: icons + status message.
 
  return (
    <main className={styles.mainContent}>
      <Hero />
      <About />
      <Experience />
    </main>
  );
}
