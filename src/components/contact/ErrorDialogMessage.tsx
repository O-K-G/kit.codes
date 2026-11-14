import { useTranslations } from 'next-intl';
import DialogTitle from '@ui/dialog/DialogTitle';
import styles from './ErrorDialogMessage.module.css';
import classNames from "@utils/classNames";

const DATA_TEST_ID = 'error-details-test';

export default function ErrorDialogMeesage({ details }: { details: string }) {
  const t = useTranslations('errorDialog');

  return (
    <div className={styles.container}>
      <DialogTitle label={t('error')} />
      <p
        role='alert'
        className={styles.message}
      >
        {t('errorMessage')}
      </p>

      <p
        data-testid={DATA_TEST_ID}
        className={classNames(styles.details, details ? styles.detailsFound : styles.detailsNotFound)}
      >
        {t('errorDetails')}&nbsp;
        {details || t('noErrorDetailsFound')}
      </p>
    </div>
  );
}
