"use client";

import IconButton from "@ui/iconButton/IconButton";
import {
  Children,
  ReactNode,
  RefObject,
  cloneElement,
  createContext,
  isValidElement,
  useRef,
  useState,
} from "react";
import useHandleHorizontalScroll from "@hooks/useHandleHorizontalScroll";
import { ScrollableSubsectionItemProps } from "@constants/interfaces";
import ArrowIconComponent from "@ui/icons/ArrowIconComponent";
import { useTranslations } from "next-intl";
import styles from "./ScrollableSubsection.module.css";
import classNames from "@utils/classNames";

export const LEFT_BUTTON_TEST_ID = "left-button-test-id";
export const RIGHT_BUTTON_TEST_ID = "right-button-test-id";

/**
 * What the slides need from their carousel: its scrolling area (the root they're observed in) and
 * how to tell it which slide is in view. Shared through context, as refs can't be handed to the
 * slides while rendering.
 */
export const CarouselContext = createContext<{
  scrollableRef: RefObject<HTMLDivElement | null> | null;
  onSubsectionSelectChange: (id: number) => void;
}>({
  scrollableRef: null,
  onSubsectionSelectChange: () => {},
});

/**
 * A carousel (WAI-ARIA APG carousel pattern): a region named by `aria-label` and described as a
 * carousel, with previous / next buttons and the slides (see ScrollableSubsectionItem) in a scrolling
 * area, which can be focused to scroll it with the keyboard.
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
  const { handleHorizontalScroll } = useHandleHorizontalScroll();
  const [selectedSubsection, setSelectedSubsection] = useState(0);
  const total = Children.count(children);
  /** Each slide, told its position: its id (index) and how many slides there are. (Anything that
   * isn't an element is left out.) */
  const childrenWithNewProps = Children.map(children, (child, index) =>
    isValidElement<ScrollableSubsectionItemProps>(child)
      ? cloneElement(child, { id: index, total })
      : null
  );

  const handleScroll = ({
    id,
    offsetWidth,
  }: {
    id: number;
    offsetWidth: number;
  }) => {
    setSelectedSubsection(id);
    handleHorizontalScroll({
      num: offsetWidth * id,
      scrollableRef,
    });
  };

  const handlePrevious = () => {
    const isZero = selectedSubsection - 1 > 0 ? selectedSubsection - 1 : 0;
    const id = childrenWithNewProps?.[isZero]?.props.id;

    if (id || id === 0) {
      const offsetWidth = scrollableRef.current?.offsetWidth ?? 0;

      handleScroll({ id, offsetWidth });
    }
  };

  const handleNext = () => {
    const id = childrenWithNewProps?.[selectedSubsection + 1]?.props.id;

    if (id) {
      const offsetWidth = scrollableRef.current?.offsetWidth ?? 0;

      handleScroll({ id, offsetWidth });
    }
  };

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
          disabled={!selectedSubsection}
          onClick={handlePrevious}
          className={classNames(styles.navButton, styles.previousButton)}
          aria-label={t("previous")}
          icon={<ArrowIconComponent />}
        />
      </div>
      <div
        ref={scrollableRef}
        tabIndex={0}
        className={styles.scrollable}
      >
        <CarouselContext.Provider
          value={{ scrollableRef, onSubsectionSelectChange: setSelectedSubsection }}
        >
          {childrenWithNewProps}
        </CarouselContext.Provider>
      </div>

      <div className={styles.buttonWrapper}>
        <IconButton
          data-testid={RIGHT_BUTTON_TEST_ID}
          disabled={selectedSubsection + 1 === childrenWithNewProps?.length}
          onClick={handleNext}
          className={classNames(styles.navButton, styles.nextButton)}
          aria-label={t("next")}
          icon={<ArrowIconComponent />}
        />
      </div>
    </div>
  );
}
