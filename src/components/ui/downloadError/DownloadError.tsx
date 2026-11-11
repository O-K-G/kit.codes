import { useContext } from 'react';
import { ModalContext as modalContext } from '@ui/modalContext/ModalContext';
import { useTranslations } from 'next-intl';
import DialogTitle from '@ui/dialog/DialogTitle';
import styles from './DownloadError.module.css';

export function DownloadError() {
  const { onCloseModal } = useContext(modalContext);
  const t = useTranslations('cv');

  return (
    <div
      dir='ltr'
      className={styles.content}
    >
      <DialogTitle
        className={styles.dialogTitle}
        label={t('errorTitle')}
        onClick={onCloseModal}
      />
      <p className={styles.text}>
        {t('error')}
      </p>
    </div>
  );
}
