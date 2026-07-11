import { ReactNode, RefObject } from "react";
import styles from "./section.module.css";
import { concatStyles } from "@/app/utils/concatStyles";

type SectionProps = {
  children: ReactNode;
  className?: string;
  bottomBorder?: boolean;
  id?: string;
  ref?: RefObject<HTMLElement | null>;
};

export default function Section({
  children,
  className = "",
  bottomBorder = true,
  ...rest
}: SectionProps) {
  return (
    <section
      data-bottom-border={bottomBorder}
      data-in-view="false"
      className={concatStyles([styles.section, className])}
      {...rest}
    >
      {children}
    </section>
  );
}
