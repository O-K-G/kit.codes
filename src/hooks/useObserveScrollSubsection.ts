import { UseObserveScrollSubsectionProps } from '@constants/interfaces';
import { useEffect } from 'react';

export default function useObserveScrollSubsection({
  id,
  scrollableRef,
  onSubsectionSelectChange,
  scrollableItemRef,
}: UseObserveScrollSubsectionProps) {
  useEffect(() => {
    const options = {
      root: scrollableRef?.current,
      rootMargin: '0px',
      threshold: 0.5,
    };

    const handleObserve = (e: IntersectionObserverEntry[]) => {
      const { isIntersecting } = e[0];

      if (isIntersecting) {
        onSubsectionSelectChange(Number(id));
      }
    };

    const observer = new IntersectionObserver(handleObserve, options);
    if (scrollableItemRef.current) {
      observer.observe(scrollableItemRef.current);
    }

    return () => observer.disconnect();
  }, [id, onSubsectionSelectChange, scrollableItemRef, scrollableRef]);
}
