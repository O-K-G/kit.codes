import { CSSProperties } from "react";
import { concatStyles } from "@utils/concatStyles";
import Typography from "@ui/typography/typography";
import styles from "./progressBar.module.css";

type ProgressBarProps = {
  id: string;
  startLabel: string;
  value: string;
  endLabel: string;
  className?: string;
  style?: CSSProperties;

  /** Defaults to 'li'. */
  component?: "div" | "span" | "li";
};

export default function ProgressBar({
  id,
  startLabel,
  value,
  endLabel,
  component: Component = "li",
  className = "",
  ...rest
}: ProgressBarProps) {
  return (
    <Component
      key={id}
      className={concatStyles([styles.progressBar, className])}
      {...rest}
    >
      <Typography
        component="label"
        htmlFor={id}
        color="paper"
        variant="skill-label"
      >
        {startLabel}
      </Typography>

      <progress id={id} max={100} value={value}>
        {value}
      </progress>

      <Typography component="span" color="mist" variant="skill-label">
        {endLabel}
      </Typography>
    </Component>
  );
}
