'use client';

import { useRef } from 'react';
import { useTranslations } from 'next-intl';
import useObserveScrollSubsection from '@hooks/useObserveScrollSubsection';
import { ScrollableSubsectionItemProps } from '@constants/interfaces';
import styles from './ScrollableSubsectionItem.module.css';

export const SCROLLABLE_ITEM_TEST_ID = 'scrollable-item-test-id';

/** A slide of the carousel (see ScrollableSubsectionContainer), labeled by its position: "2 of 4" */
export function ScrollableSubsectionItem({
  children,
  ref,
  total,
  ...rest
}: ScrollableSubsectionItemProps) {
  const scrollableItemRef = useRef(null);
  const t = useTranslations('scrollableSectionText');

  useObserveScrollSubsection({
    ...rest,
    scrollableItemRef,
    scrollableRef: ref,
  });

  return (
    <div
      role="group"
      aria-roledescription={t('slide')}
      aria-label={t('slideLabel', { index: Number(rest.id) + 1, total: Number(total) })}
      data-testid={SCROLLABLE_ITEM_TEST_ID}
      ref={scrollableItemRef}
      className={styles.item}
    >
      {children}
    </div>
  );
}
