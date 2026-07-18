import Typography from "@ui/typography/typography";
import styles from "./errors.module.css";
import { ReactNode } from "react";
import { concatStyles } from "@utils/concatStyles";

type ErrorsProps = {
  label: ReactNode;
  className?: string;
  children?: ReactNode;
};

export default function Errors({
  label,
  className = "",
  children,
  ...rest
}: ErrorsProps) {
  return (
    <div className={concatStyles([styles.errors, className])} {...rest}>
      <Typography component="h2" color="paper" variant="project-heading">
        {label}
      </Typography>
      {children}
    </div>
  );
}
