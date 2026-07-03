import { ReactNode } from "react";
import styles from "./section.module.css";
import { concatStyles } from "@/app/utils/concatStyles";

type SectionProps = {
  children: ReactNode;
  className?: string;
};

export default function Section({
  children,
  className = "",
  ...rest
}: SectionProps) {
  return (
    <section className={concatStyles([styles.section, className])} {...rest}>
      {children}
    </section>
  );
}
