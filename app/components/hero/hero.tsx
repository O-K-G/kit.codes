import Typography from "@ui/typography/typography";
import styles from "./hero.module.css";
import HeroButtons from "./heroButtons";
import VideoBanner from "./videoBanner";

const EYEBROW = "G · Lobby — now showing";
const TITLE = "Kit Geda";
const SUBTITLE = "Full-stack web developer";
const PARAGRAPH = "6 years building for the web for banking and tech";
const DATA = [
  {
    component: "p",
    variant: "eyebrow",
    color: "window",
    content: EYEBROW,
    className: styles.eyebrow,
  },

  {
    component: "h1",
    variant: "hero-name",
    color: "paper",
    content: TITLE,
  },
  {
    component: "p",
    variant: "hero-role",
    color: "paper",
    content: SUBTITLE,
    className: styles.heroRole,
  },
  {
    component: "p",
    variant: "hero-tag",
    color: "mist",
    content: PARAGRAPH,
    className: styles.heroTag,
  },
] as const;

export default function Hero() {
  return (
    <section className={styles.hero}>
      {DATA.map(({ content, ...rest }) => (
        <Typography key={content} {...rest}>
          {content}
        </Typography>
      ))}
      <HeroButtons />

     
      <VideoBanner />
    </section>
  );
}
