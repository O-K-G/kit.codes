import { EXPERIENCE_YEARS, SECTION_IDS } from "@/app/page.constants";

export const ABOUT_BADGES = [
  `${EXPERIENCE_YEARS} yrs experience`,
  "React & Next.js",
  "Banking & Tech",
  "WCAG & AODA",
  "AI boosted",
];

export const CONTENT = {
  id: SECTION_IDS.about,
  eyebrow: "1 · About",
  title: "The foundation",
  paragraph: (
    <>
      A Canada based full-stack web developer, with experience in the corporate
      banking and tech sectors delivering production ready React.js apps and
      websites since 2019. Experience includes&nbsp;
      <b>best industry standards</b> such as typing, linting, accessibility,
      SEO, internationalization, localization, testing, cross-broswer
      compatibility, tracking, building everything in a{" "}
      <b>modular, generic, and well documented architecture</b> - so everyone on
      all levels can easily understand the code, and of-course - AI tools to
      speed things up.
    </>
  ),
};
