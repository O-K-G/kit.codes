import { ReactNode } from "react";
import styles from "./section.module.css";
import { concatStyles } from "@utils/concatStyles";
import SectionObserver from "./SectionObserver";

type SectionProps = {
  children: ReactNode;
  className?: string;
  bottomBorder?: boolean;
  id: string;
};

export default function Section({
  children,
  className = "",
  bottomBorder = true,
  id,
  ...rest
}: SectionProps) {
  return (
    <>
      <SectionObserver id={id} />
      <section
        id={id}
        data-bottom-border={bottomBorder}
        data-in-view="false"
        className={concatStyles([styles.section, className])}
        {...rest}
      >
        {children}
      </section>
    </>
  );
}
