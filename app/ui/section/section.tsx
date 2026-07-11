"use client";

import { ReactNode } from "react";
import styles from "./section.module.css";
import { concatStyles } from "@utils/concatStyles";
import { useFadeIn } from "@/app/hooks/useFadeIn";

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
  useFadeIn({ id });

  return (
    <section
      id={id}
      data-bottom-border={bottomBorder}
      data-in-view="false"
      className={concatStyles([styles.section, className])}
      {...rest}
    >
      {children}
    </section>
  );
}
