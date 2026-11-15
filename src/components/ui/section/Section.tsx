import { SectionProps } from "@constants/interfaces";
import SectionBackground from "@ui/sectionBackground/SectionBackground";
import SectionScrollAnchor from "@ui/section/SectionScrollAnchor";
import styles from "./Section.module.css";
import classNames from "@utils/classNames";

const SCROLLABLE_SECTIONS = ["about", "skills", "experience", "reviews"];

export default function Section({
  className = styles.defaultLayout,
  children,
  currentSection,
  activeSection,
}: SectionProps) {
  const isScrollable =
    !!currentSection && SCROLLABLE_SECTIONS.includes(currentSection);

  return (
    <section
      data-nosnippet
      className={classNames(styles.section, className)}
    >
      {isScrollable ? (
        <SectionScrollAnchor
          currentSection={currentSection}
          className={styles.hiddenAnchor}
        />
      ) : (
        <div className={styles.hiddenAnchor} />
      )}
      <SectionBackground
        currentSection={currentSection}
        priority={!!currentSection && currentSection === activeSection}
      />
      {children}
    </section>
  );
}
