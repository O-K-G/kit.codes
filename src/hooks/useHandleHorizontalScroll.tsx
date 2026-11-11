import { RefObject } from 'react';
import { useParams } from 'next/navigation';
import getDirByLocale from '@utils/getDirByLocale';

export default function useHandleHorizontalScroll() {
  const { locale }: { locale: string } = useParams() || {};

  const handleHorizontalScroll = ({
    num,
    scrollableRef,
  }: {
    num: number;
    scrollableRef: RefObject<HTMLDivElement | null>;
  }) => {
    const dir = getDirByLocale({ locale });
    const numByDir = dir === 'ltr' ? num : -num;

    // Smooth only when motion is allowed: follows the container's scroll-behavior (CSS).
    scrollableRef.current?.scrollTo({
      top: 0,
      left: numByDir,
    });
  };

  return { handleHorizontalScroll };
}
