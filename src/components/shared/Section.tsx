"use client";

import { SectionProps } from "@constants/interfaces";
import SectionBackground from "@components/shared/SectionBackground";
import { usePathname } from "next/navigation";
import { useEffect, useRef } from "react";
import styles from "./Section.module.css";

export default function Section({
  className = styles.defaultLayout,
  children,
  currentSection,
}: SectionProps) {
  const pathname = usePathname();
  const sectionRef = useRef(null);

  useEffect(() => {
    const isScroll =
      ["about", "skills", "experience", "projects"].includes(
        currentSection as string
      ) && pathname.includes(currentSection as string);

    if (isScroll) {
      (sectionRef.current as unknown as HTMLElement).scrollIntoView({
        behavior: "smooth",
        block: "start",
        inline: "start",
      });
    }
  }, [currentSection, pathname]);

  return (
    <section
      data-nosnippet
      ref={sectionRef}
      className={`${styles.section} ${className ?? ""}`}
    >
      <div className={styles.hiddenAnchor} />
      <SectionBackground currentSection={currentSection} />
      {children}
    </section>
  );
}
