import { IconsProps } from "@constants/interfaces";
import styles from "./RocketIcon.module.css";
import classNames from "@utils/classNames";

/** A rocket, upright (Material Symbols). Its colors are its CSS's (see RocketIcon.module.css) */
export default function RocketIcon({ className }: IconsProps) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      aria-hidden
      focusable="false"
      className={classNames(styles.icon, className)}
    >
      <path d="M6,19.05l1.98-0.8q-0.25-0.73-0.46-1.48t-0.34-1.5L6,16.08v2.98ZM10,18h4q0.45-1 0.73-2.44T15,12.63q0-2.48-0.82-4.69Q13.35,5.72 12,4.52q-1.35,1.2-2.17,3.41T9,12.63q0,1.5 0.28,2.94T10,18Zm0.59-5.59Q10,11.83 10,11q0-0.83 0.59-1.41T12,9t1.41,0.59T14,11t-0.59,1.41T12,13t-1.41-0.59ZM18,19.05V16.08l-1.18-0.8q-0.13,0.75-0.34,1.5t-0.46,1.48L18,19.05ZM12,1.97q2.48,1.8 3.74,4.58Q17,9.32 17,13l2.1,1.4q0.43,0.28 0.66,0.73T20,16.08V22l-4.97-2H8.98L4,22V16.08q0-0.5 0.24-0.95Q4.48,14.68 4.9,14.4L7,13Q7,9.32 8.26,6.55Q9.53,3.77 12,1.97Z" />
    </svg>
  );
}
