import Section from "@ui/section/section";
import Typography from "@ui/typography/typography";
import styles from "./contentSection.module.css";
import { ReactNode } from "react";
import { concatStyles } from "@/app/utils/concatStyles";

type ContentSection = {
  eyebrow: string;
  title: string;
  paragraph?: ReactNode;
  slot?: ReactNode;
  className?: string;
  bottomBorder?: boolean;
  id: string;
};

export default function ContentSection({
  eyebrow,
  title,
  paragraph,
  className = "",
  slot,
  ...rest
}: ContentSection) {
  return (
    <Section
      data-visible="false"
      className={concatStyles([styles.contentSection, className])}
      {...rest}
    >
      {/* Claude PR: the eyebrow "kicker" text was an h2 while the visually-primary
          section title below it was h3 — an inverted heading hierarchy, and it also
          left the Card titles nested inside sections (also h3) at the same rank as
          their parent's own title instead of one level deeper. The eyebrow is
          supplementary label text, not a new topic, so it's no longer a heading at
          all; the title is now h2, which correctly outranks the nested h3 Card
          titles. Only the `component` tag changes — `data-variant` stays the same,
          so styling is untouched. */}
      <Typography component="p" color="mist" variant="eyebrow">
        {eyebrow}
      </Typography>

      <Typography component="h2" color="paper" variant="section-heading">
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
