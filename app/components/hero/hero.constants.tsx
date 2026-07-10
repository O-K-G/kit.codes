import styles from "./hero.module.css";

const EYEBROW = "G · Lobby — now showing";
const TITLE = "Kit Geda";
const SUBTITLE = "Full-stack web developer";
const PARAGRAPH = "6 years building for the web for banking and tech";
export const VIDEO = {
  primarySrc: "/videos/test.mp4",
  primarySrcType: "video/mp4",
};
export const DATA = [
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
