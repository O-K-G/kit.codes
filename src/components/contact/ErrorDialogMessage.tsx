import { useTranslations } from 'next-intl';
import { useContext } from 'react';
import { ModalContext as modalContext } from '@ui/modalContext/ModalContext';
import DialogTitle from '@ui/dialog/DialogTitle';
import styles from './ErrorDialogMessage.module.css';

const DATA_TEST_ID = 'error-details-test';

export default function ErrorDialogMeesage({ details }: { details: string }) {
  const { onCloseModal } = useContext(modalContext);
  const t = useTranslations('errorDialog');

  return (
    <div className={styles.container}>
      <DialogTitle label={t('error')} onClick={onCloseModal} />
      <p
        role='alert'
        className={styles.message}
      >
        {t('errorMessage')}
      </p>

      <p
        data-testid={DATA_TEST_ID}
        className={`${styles.details} ${
          details ? styles.detailsFound : styles.detailsNotFound
        }`}
      >
        {t('errorDetails')}&nbsp;
        {details || t('noErrorDetailsFound')}
      </p>
    </div>
  );
}
