import Typography from "@ui/typography/typography";
import styles from "./hero.module.css";
import HeroButtons from "./heroButtons";
import VideoBackground from "./videoBackground";
import Section from "@ui/section/section";
import { DATA } from "./hero.constants";

export default function Hero() {
  return (
    <Section className={styles.hero}>
      <VideoBackground />
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
