import { EXPERIENCE_YEARS } from "@/app/page.constants";
import styles from "./hero.module.css";

const EYEBROW = "G · Lobby — now showing";
const TITLE = "Kit G.";
const SUBTITLE = "Full-stack Web Developer";
const PARAGRAPH = `${EXPERIENCE_YEARS} years of full-stack web development`;
export const VIDEO = {
  primarySrc: "/videos/city-night.webm",
  primarySrcType: "video/webm",
  backupSrc: "/videos/city-night.mp4",
  backupSrcType: "video/mp4",
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
