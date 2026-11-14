'use client';

import { useContext, useRef } from 'react';
import { useTranslations } from 'next-intl';
import useObserveScrollSubsection from '@hooks/useObserveScrollSubsection';
import { ScrollableSubsectionItemProps } from '@constants/interfaces';
import { CarouselContext } from './ScrollableSubsectionContainer';
import styles from './ScrollableSubsectionItem.module.css';

export const SCROLLABLE_ITEM_TEST_ID = 'scrollable-item-test-id';

/** A slide of the carousel (see ScrollableSubsectionContainer), labeled by its position: "2 of 4" */
export function ScrollableSubsectionItem({
  children,
  id,
  total,
}: ScrollableSubsectionItemProps) {
  const scrollableItemRef = useRef<HTMLDivElement>(null);
  const t = useTranslations('scrollableSectionText');
  const { scrollableRef, onSubsectionSelectChange } = useContext(CarouselContext);

  useObserveScrollSubsection({
    id,
    scrollableRef,
    onSubsectionSelectChange,
    scrollableItemRef,
  });

  return (
    <div
      role="group"
      aria-roledescription={t('slide')}
      aria-label={t('slideLabel', { index: Number(id) + 1, total: Number(total) })}
      data-testid={SCROLLABLE_ITEM_TEST_ID}
      ref={scrollableItemRef}
      className={styles.item}
    >
      {children}
    </div>
  );
}
