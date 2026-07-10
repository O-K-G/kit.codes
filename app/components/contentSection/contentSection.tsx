"use client";

import Section from "@ui/section/section";
import Typography from "@ui/typography/typography";
import styles from "./contentSection.module.css";
import { ReactNode, useRef } from "react";
import { concatStyles } from "@/app/utils/concatStyles";
import { useFadeIn } from "@/app/hooks/useFadeIn";

type ContentSection = {
  eyebrow: string;
  title: string;
  paragraph?: ReactNode;
  slot?: ReactNode;
  className?: string;
  bottomBorder?: boolean;
};

export default function ContentSection({
  eyebrow,
  title,
  paragraph,
  className = "",
  slot,
  ...rest
}: ContentSection) {
  const sectionRef = useRef<HTMLElement>(null);
  useFadeIn({ ref: sectionRef });

  return (
    <Section
      ref={sectionRef}
      data-visible="false"
      className={concatStyles([styles.contentSection, className])}
      {...rest}
    >
      <Typography component="h2" color="mist" variant="eyebrow">
        {eyebrow}
      </Typography>

      <Typography component="h3" color="paper" variant="section-heading">
        {title}
      </Typography>

      {paragraph && (
        <Typography component="p" color="mist">
          {paragraph}
        </Typography>
      )}

      {slot}
    </Section>
  );
}
