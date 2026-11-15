"use client";

import IconButton from "@ui/iconButton/IconButton";
import {
  Children,
  ReactNode,
  cloneElement,
  isValidElement,
  useEffect,
  useRef,
  useState,
} from "react";
import { ScrollableSubsectionItemProps } from "@constants/interfaces";
import ArrowIconComponent from "@ui/icons/ArrowIconComponent";
import { useTranslations } from "next-intl";
import styles from "./ScrollableSubsection.module.css";
import classNames from "@utils/classNames";

export const LEFT_BUTTON_TEST_ID = "left-button-test-id";
export const RIGHT_BUTTON_TEST_ID = "right-button-test-id";

/** How much of a slide must be in view for it to count as the current one */
const SLIDE_IN_VIEW_THRESHOLD = 0.5;

/**
 * A carousel (WAI-ARIA APG carousel pattern): a region named by `aria-label` and described as a
 * carousel, with previous / next buttons and the slides (see ScrollableSubsectionItem) in a scrolling
 * area, which can be focused to scroll it with the keyboard. The current slide is the one in view,
 * however it got there (the buttons, the keyboard, a swipe): one observer watches them all.
 */
export default function ScrollableSubsectionContainer({
  children,
  "aria-label": ariaLabel,
}: {
  children: ReactNode;
  "aria-label": string;
}) {
  const scrollableRef = useRef<HTMLDivElement>(null);
  const t = useTranslations("scrollableSectionText");
  const [selectedSubsection, setSelectedSubsection] = useState(0);
  /** The slides (anything that isn't an element is left out), each told its position */
  const slides = Children.toArray(children).filter(isValidElement<ScrollableSubsectionItemProps>);
  const total = slides.length;

  useEffect(() => {
    const scrollable = scrollableRef.current;
    if (!scrollable) {
      return;
    }

    const observer = new IntersectionObserver(
      (entries) =>
        entries
          .filter(({ isIntersecting }) => isIntersecting)
          .forEach(({ target }) =>
            setSelectedSubsection(Array.prototype.indexOf.call(scrollable.children, target))
          ),
      { root: scrollable, threshold: SLIDE_IN_VIEW_THRESHOLD }
    );
    Array.from(scrollable.children).forEach((slide) => observer.observe(slide));

    return () => observer.disconnect();
  }, [total]);

  /** Scrolls to a slide: each is the scrolling area's width, laid out from its start edge (the right,
   * in right-to-left languages, where scrolling goes negative). Smooth only when motion is allowed:
   * the area's scroll-behavior (CSS) decides */
  const goTo = (index: number) => {
    const scrollable = scrollableRef.current;
    if (!scrollable || index < 0 || index >= total) {
      return;
    }

    setSelectedSubsection(index);
    const direction = getComputedStyle(scrollable).direction === "rtl" ? -1 : 1;
    scrollable.scrollTo({ top: 0, left: direction * index * scrollable.offsetWidth });
  };

  const handlePrevious = () => goTo(selectedSubsection - 1);
  const handleNext = () => goTo(selectedSubsection + 1);

  return (
    <div
      role="region"
      aria-roledescription={t("carousel")}
      aria-label={ariaLabel}
      className={styles.container}
    >
      <div className={styles.buttonWrapper}>
        <IconButton
          data-testid={LEFT_BUTTON_TEST_ID}
          disabled={selectedSubsection === 0}
          onClick={handlePrevious}
          className={classNames(styles.navButton, styles.previousButton)}
          aria-label={t("previous")}
          icon={<ArrowIconComponent />}
        />
      </div>
      <div ref={scrollableRef} tabIndex={0} className={styles.scrollable}>
        {slides.map((slide, index) => cloneElement(slide, { id: index, total }))}
      </div>

      <div className={styles.buttonWrapper}>
        <IconButton
          data-testid={RIGHT_BUTTON_TEST_ID}
          disabled={selectedSubsection >= total - 1}
          onClick={handleNext}
          className={classNames(styles.navButton, styles.nextButton)}
          aria-label={t("next")}
          icon={<ArrowIconComponent />}
        />
      </div>
    </div>
  );
}
