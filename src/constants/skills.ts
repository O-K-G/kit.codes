/** How many segments a skill bar holds when full (100%) */
export const SKILL_MAX_SEGMENTS = 50;

/** Each skill and how many of its bar's segments are filled (out of SKILL_MAX_SEGMENTS) */
export const SKILLS = {
  HTML: 41,
  CSS: 29,
  JavaScript: 43,
  TypeScript: 36,
  "React.js": 26,
  "Next.js": 50,
  "Node.js": 41,
  tailwindcss: 45,
  "Async JS": 26,
  "REST API": 27,
  Microservices: 35,
  MongoDB: 33,
  A11y: 31,
  i18n: 33,
  Zod: 42,
  "Unit tests": 43,
} as const satisfies Record<string, number>;
