import { URLS } from "@/app/page.constants";
import { openCloseDialog } from "@ui/dialog/dialog";
import { handleOpenExternalWindow } from "@utils/handleOpenExternalWindow";

export const EYEBROW = "R · Rooftop";
export const TITLE = "Buzz me in";
export const PARAGRAPH = "Front desk is staffed most hours. Pick a button.";
export const BUZZER_LABEL = "K. G. · Web Developer — ring any button below";
export const BUTTONS = [
  { label: "Email", onClick: openCloseDialog },
  { label: "GitHub", onClick: () => handleOpenExternalWindow(URLS.gitHub) },
  {
    label: "LinkedIn",
    onClick: () => handleOpenExternalWindow(URLS.linkedIn),
  },
  { label: "Résumé", onClick: () => handleOpenExternalWindow(URLS.resume) },
];
