import IconButton from "@components/shared/IconButton";
import { useState, useRef, ReactNode } from "react";
import useHandleHorizontalScroll from "@hooks/useHandleHorizontalScroll";
import useHandleChildrenWithNewProps from "@hooks/useHandleChildrenWithNewProps";
import { PropsWithId } from "@constants/interfaces";
import { ScrollableSubsectionItem } from "@components/shared/scrollableSection/ScrollableSubsectionItem";
import ArrowIconComponent from "@components/icons/ArrowIconComponent";
import { useTranslations } from "next-intl";
import styles from "./ScrollableSubsection.module.css";

export const LEFT_BUTTON_TEST_ID = "left-button-test-id";
export const RIGHT_BUTTON_TEST_ID = "right-button-test-id";

export default function ScrollableSubsection({
  children,
}: {
  children: ReactNode;
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
    <div className={styles.container}>
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
          className={`${styles.navButton} ${styles.previousButton}`}
          aria-label={t("scrollLeft")}
          icon={<ArrowIconComponent />}
        />
      </div>
      <div
        ref={scrollableRef}
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
          className={`${styles.navButton} ${styles.nextButton}`}
          aria-label={t("scrollRight")}
          icon={<ArrowIconComponent />}
        />
      </div>
    </div>
  );
}

ScrollableSubsection.Item = ScrollableSubsectionItem;
