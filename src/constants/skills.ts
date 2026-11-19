/** How many segments a skill bar holds when full (100%). 20, so every level below (in steps of 5%)
 * lights a whole number of segments, and each segment's chevron is wide enough to read on phones */
export const SKILL_MAX_SEGMENTS = 20;

/** The skills, in groups (each named in messages/<locale>/skills.json, under "groups"), each with its
 * level in percent */
export const SKILL_GROUPS = [
  {
    id: "frontEnd",
    skills: {
      HTML: 100,
      CSS: 100,
      "JavaScript/TypeScript": 100,
      "React.js": 100,
      "Next.js": 100,
      "Accessibility (WCAG)": 100,
    },
  },
  {
    id: "backEnd",
    skills: {
      "Node.js": 95,
      "Express.js": 95,
      Firebase: 80,
    },
  },
  {
    id: "databases",
    skills: {
      SQL: 80,
      NoSQL: 80,
    },
  },
  {
    id: "general",
    skills: {
      "REST API": 80,
      GraphQL: 80,
      "AI usage": 80,
    },
  },
] as const satisfies readonly { id: string; skills: Record<string, number> }[];

/** Shorter names shown on phones, so the names' column is narrower and the bars get the room (see
 * SkillBar). Screen readers still get the full name */
export const SKILL_SHORT_NAMES: Partial<Record<string, string>> = {
  "JavaScript/TypeScript": "JavaScript+TS",
  "Accessibility (WCAG)": "Accessibility",
};

export type SkillGroupId = (typeof SKILL_GROUPS)[number]["id"];

/** How many of a bar's segments a level (in percent) lights */
export const skillSegments = (percent: number) =>
  Math.round((percent / 100) * SKILL_MAX_SEGMENTS);

/**
 * Where a bar's chevrons are (as in the CSS, see SkillBars' .segments), in pixels, for a bar of this
 * width and height: each one's point is half the height deep (45° arms), or 30% of a full share of
 * the width if more (pointier, on wide bars); they're 30% of a share apart, down to 20% on small
 * chevrons (a share under 30px, on phones), or at most half the point's depth, so each point enters
 * the next one's notch; and the last one's point ends at the bar's end. `step` is from one chevron to
 * the next, `arm` is a chevron's width (less its point).
 */
export const skillChevrons = (width: number, height: number) => {
  const share = width / SKILL_MAX_SEGMENTS;
  const tip = Math.max(height / 2, 0.3 * share);
  const gap = Math.min(Math.max(0.2 * share, 0.3 * share - 3), 0.3 * share, tip / 2);
  const step = (width + gap - tip) / SKILL_MAX_SEGMENTS;

  return { tip, step, arm: step - gap };
};
