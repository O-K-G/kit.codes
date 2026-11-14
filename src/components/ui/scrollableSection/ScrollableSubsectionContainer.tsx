"use client";

import IconButton from "@ui/iconButton/IconButton";
import { useState, useRef, ReactNode } from "react";
import useHandleHorizontalScroll from "@hooks/useHandleHorizontalScroll";
import useHandleChildrenWithNewProps from "@hooks/useHandleChildrenWithNewProps";
import { PropsWithId } from "@constants/interfaces";
import ArrowIconComponent from "@ui/icons/ArrowIconComponent";
import { useTranslations } from "next-intl";
import styles from "./ScrollableSubsection.module.css";
import classNames from "@utils/classNames";

export const LEFT_BUTTON_TEST_ID = "left-button-test-id";
export const RIGHT_BUTTON_TEST_ID = "right-button-test-id";

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
  const scrollableRef = useRef(null);
  const t = useTranslations("scrollableSectionText");
  const { handleHorizontalScroll } = useHandleHorizontalScroll();
  const [selectedSubsection, setSelectedSubsection] = useState(0);
  const { handleChildrenWithNewProps } = useHandleChildrenWithNewProps();
  const childrenWithNewProps = handleChildrenWithNewProps({
    children,
    scrollableRef,
    onSubsectionSelectChange: setSelectedSubsection,
  });

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
          onClick={() => {
            const isZero =
              selectedSubsection - 1 > 0 ? selectedSubsection - 1 : 0;
            const id = (childrenWithNewProps?.[isZero]?.props as PropsWithId)
              ?.id;

            if (id || id === 0) {
              const { offsetWidth } =
                (scrollableRef.current as unknown as HTMLDivElement) || 0;

              handleScroll({ id, offsetWidth });
            }
          }}
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
        {childrenWithNewProps}
      </div>

      <div className={styles.buttonWrapper}>
        <IconButton
          data-testid={RIGHT_BUTTON_TEST_ID}
          disabled={selectedSubsection + 1 === childrenWithNewProps?.length}
          onClick={() => {
            const id = (
              childrenWithNewProps?.[selectedSubsection + 1]
                ?.props as PropsWithId
            )?.id;

            if (id) {
              const { offsetWidth } =
                (scrollableRef.current as unknown as HTMLDivElement) || 0;

              handleScroll({ id, offsetWidth });
            }
          }}
          className={classNames(styles.navButton, styles.nextButton)}
          aria-label={t("next")}
          icon={<ArrowIconComponent />}
        />
      </div>
    </div>
  );
}
