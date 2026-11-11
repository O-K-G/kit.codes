'use client';

import { useRef } from 'react';
import useObserveScrollSubsection from '@hooks/useObserveScrollSubsection';
import { ScrollableSubsectionItemProps } from '@constants/interfaces';
import styles from './ScrollableSubsectionItem.module.css';

export const SCROLLABLE_ITEM_TEST_ID = 'scrollable-item-test-id';

export function ScrollableSubsectionItem({
  children,
  onSubsectionSelectChange,
  id,
  ref,
}: ScrollableSubsectionItemProps) {
  const scrollableRef = ref;
  const scrollableItemRef = useRef(null);

  useObserveScrollSubsection({
    id,
    onSubsectionSelectChange,
    scrollableItemRef,
    scrollableRef,
  });

  return (
    <div
      data-testid={SCROLLABLE_ITEM_TEST_ID}
      ref={scrollableItemRef}
      className={styles.item}
    >
      {children}
    </div>
  );
}
