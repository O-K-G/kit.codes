import { URLS } from "@/app/page.constants";

export const EYEBROW = "R · Rooftop";
export const TITLE = "Buzz me in";
export const PARAGRAPH = "Front desk is staffed most hours. Pick a button.";
export const BUZZER_LABEL = "Kit G. · Web Developer — ring any button below";
export const EMAIL_BUTTON_LABEL = "Email";
export const BUTTONS = [
  { label: "GitHub", href: URLS.gitHub, component: "a" },
  {
    label: "LinkedIn",
    href: URLS.linkedIn,
    component: "a",
  },
  { label: "Résumé", href: URLS.resume, component: "a" },
] as const;
