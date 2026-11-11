'use client';

import IconButton from '@ui/iconButton/IconButton';
import { useTranslations } from 'next-intl';
import useHandleDownload from '@hooks/useHandleDownload';
import CvIcon from '@ui/icons/Cv';
import { CvProps } from '@constants/interfaces';
import { DownloadError } from '@ui/downloadError/DownloadError';
import { URLs } from '@constants/urls';
import styles from './DownloadButton.module.css';

export default function DownloadButton({ hide }: CvProps) {
  const t = useTranslations('cv');
  const { handleDownload } = useHandleDownload();
  const { cvFileURL } = URLs;

  if (hide) {
    return null;
  }

  return (
    <IconButton
      className={styles.iconButton}
      icon={<CvIcon className={styles.icon} />}
      aria-label={t('download')}
      onClick={() =>
        handleDownload({
          url: cvFileURL,
          fileName: t('filename'),
          errorModalContent: <DownloadError />,
        })
      }
    />
  );
}
