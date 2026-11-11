"use client";

import { usePathname } from "next/navigation";
import { useEffect, useRef } from "react";

/** Scrolls its parent <section> into view when the URL points at `currentSection`. */
export default function SectionScrollAnchor({
  currentSection,
  className,
}: {
  currentSection: string;
  className?: string;
}) {
  const pathname = usePathname();
  const anchorRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (pathname.includes(currentSection)) {
      anchorRef.current?.parentElement?.scrollIntoView({
        behavior: "smooth",
        block: "start",
        inline: "start",
      });
    }
  }, [currentSection, pathname]);

  return <div ref={anchorRef} className={className} />;
}
