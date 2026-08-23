import Typography from "@ui/typography/typography";
import styles from "./hero.module.css";
import HeroButtons from "./heroButtons";
import Section from "@ui/section/section";
import { DATA } from "./hero.constants";
import { SECTION_IDS } from "@/app/page.constants";

export default function Hero() {
  return (
    <Section id={SECTION_IDS.hero} className={styles.hero}>
      <div className={styles.textArea}>
        {DATA.map(({ content, ...rest }) => (
          <Typography key={content} {...rest}>
            {content}
          </Typography>
        ))}
        <HeroButtons />
      </div>
    </Section>
  );
}
