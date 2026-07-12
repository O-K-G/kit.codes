import Badge from "@ui/badge/badge";

export const EYEBROW = "3 · Why me";
export const TITLE = "Four storefronts, still open.";
export const LABEL = "Open";
export const BREAKING_LETTER = "e";
export const CARDS = [
  {
    leftSlot: "Unit 3A",
    rightSlot: (
      <Badge rotate="left" label={LABEL} breakingLetter={BREAKING_LETTER} />
    ),
    title: "Production-Ready, Not Just Demo-Ready",
    subtitle:
      "Six years shipping React and Next.js apps that survive real users, strict security reviews, and enterprise stakeholders — not just proof-of-concepts.",
    badges: ["React", "Next", "TS"],
  },
  {
    leftSlot: "Unit 3B",
    rightSlot: (
      <Badge rotate="right" label={LABEL} breakingLetter={BREAKING_LETTER} />
    ),
    title: "Accessibility Isn't an Afterthought",
    subtitle:
      "WCAG and AODA (accessibility) compliance built in from day one, across banking portals and public sites, because the standard isn't optional.",
    badges: ["WCAG", "AODA", "A11y"],
  },
  {
    leftSlot: "Unit 3C",
    rightSlot: (
      <Badge
        rotate="left"
        label={LABEL}
        breakingLetter={BREAKING_LETTER}
        letterBlink
        borderBlink
      />
    ),
    title: "Led Teams, Not Just Tickets",
    subtitle:
      "From junior developer to Team Lead and Scrum Master — grew teams while shipping production-ready work under real deadlines.",
    badges: ["Leadership", "Scrum", "Mentoring"],
  },
  {
    leftSlot: "Unit 3D",
    rightSlot: (
      <Badge rotate="right" label={LABEL} breakingLetter={BREAKING_LETTER} />
    ),
    title: "Zero-Downtime, Full Ownership",
    subtitle:
      "Founding-engineer experience: auth, database, and infrastructure owned end-to-end, plus migrations that ran old and new in parallel until launch.",
    badges: ["Full-stack", "Auth", "Migrations"],
  },
];
