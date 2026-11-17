import PlanetIcon from "@ui/icons/PlanetIcon";
import RocketIcon from "@ui/icons/RocketIcon";
import RocketLaunchIcon from "@ui/icons/RocketLaunchIcon";
import SatelliteIcon from "@ui/icons/SatelliteIcon";

/**
 * The experience timeline's branches, top to bottom: each one's year, the keys
 * of its title and text in the "experience" messages, and its icon.
 */
export const EXPERIENCE_TIMELINE = [
  { year: "2020", titleKey: "faiMainTitle2", textKey: "faiDescription2", Icon: RocketLaunchIcon },
  { year: "2021", titleKey: "bankMainTitle", textKey: "bankMainTitleDescription", Icon: PlanetIcon },
  { year: "2024", titleKey: "faiMainTitle", textKey: "faiDescription", Icon: RocketIcon },
  { year: "2025", titleKey: "volteraMainTitle", textKey: "volteraDescription", Icon: SatelliteIcon },
] as const;
