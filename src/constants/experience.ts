import PlanetIcon from "@ui/icons/PlanetIcon";
import RocketIcon from "@ui/icons/RocketIcon";
import RocketLaunchIcon from "@ui/icons/RocketLaunchIcon";
import SatelliteIcon from "@ui/icons/SatelliteIcon";

/**
 * The experience timeline's branches, top to bottom: each one's year (a placeholder for now), the keys
 * of its title and text in the "experience" messages, and its icon.
 */
export const EXPERIENCE_TIMELINE = [
  { year: "20XX", titleKey: "faiMainTitle2", textKey: "faiDescription2", Icon: RocketLaunchIcon },
  { year: "20XX", titleKey: "bankMainTitle", textKey: "bankMainTitleDescription", Icon: PlanetIcon },
  { year: "20XX", titleKey: "faiMainTitle", textKey: "faiDescription", Icon: RocketIcon },
  { year: "20XX", titleKey: "volteraMainTitle", textKey: "volteraDescription", Icon: SatelliteIcon },
] as const;
