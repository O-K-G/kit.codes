'use client';

import Loader from '@components/shared/Loader';
import { useEffect } from 'react';
import ProgressIcon from '@components/contactForm/ProgressIcon';
import IconButton from '@components/shared/IconButton';
import { useTranslations } from 'next-intl';
import styles from './error.module.css';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const t = useTranslations('error');

  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <Loader
      open
      label={t('label')}
      loaderTextAdditionalSlot={
        <div
          role='alert'
          aria-label={t('label')}
          className={styles.alert}
        >
          <IconButton
            onClick={reset}
            className={styles.retryButton}
            aria-label={t('ariaLabel')}
            icon={
              <ProgressIcon className={styles.retryIcon} />
            }
          />
          <h2
            aria-hidden
            className={styles.subtitle}
          >
            {t('subtitle')}
          </h2>
        </div>
      }
    />
  );
}
