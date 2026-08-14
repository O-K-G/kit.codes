import { URLS } from "@/app/page.constants";

export const BUTTONS = {
  email: { label: "Email me", variant: "fill-sky-deep" },
  gitHub: { label: "GitHub", href: URLS.gitHub, component: "a" },
  resume: {
    label: "Résumé",
    href: URLS.resume,
    component: "a",
    target: "_self",
  },
} as const;
