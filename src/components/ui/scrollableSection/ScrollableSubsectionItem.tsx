'use client';

import { useTranslations } from 'next-intl';
import { ScrollableSubsectionItemProps } from '@constants/interfaces';
import styles from './ScrollableSubsectionItem.module.css';

export const SCROLLABLE_ITEM_TEST_ID = 'scrollable-item-test-id';

/** A slide of the carousel (see ScrollableSubsectionContainer, which watches which one is in view),
 * labeled by its position: "2 of 4" */
export function ScrollableSubsectionItem({
  children,
  id,
  total,
}: ScrollableSubsectionItemProps) {
  const t = useTranslations('scrollableSectionText');

  return (
    <div
      role="group"
      aria-roledescription={t('slide')}
      aria-label={t('slideLabel', { index: Number(id) + 1, total: Number(total) })}
      data-testid={SCROLLABLE_ITEM_TEST_ID}
      className={styles.item}
    >
      {children}
    </div>
  );
}
