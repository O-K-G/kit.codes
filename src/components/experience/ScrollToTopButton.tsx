'use client';

import IconButton from '@ui/iconButton/IconButton';
import ArrowUpIcon from '@components/experience/ArrowUpIcon';

export default function ScrollToTopButton({ label }: { label: string }) {
  return (
    <IconButton
      aria-label={label}
      icon={<ArrowUpIcon />}
      onClick={() => {
        window.scrollTo({
          top: 0,
          left: 0,
          behavior: 'smooth',
        });
      }}
    />
  );
}
