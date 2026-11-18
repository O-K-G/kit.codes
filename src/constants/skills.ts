/** How many segments a skill bar holds when full (100%). 60, so every level below (in steps of 5%)
 * lights a whole number of segments */
export const SKILL_MAX_SEGMENTS = 60;

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
