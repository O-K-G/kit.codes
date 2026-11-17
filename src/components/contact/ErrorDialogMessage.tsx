import { useTranslations } from 'next-intl';
import DialogTitle from '@ui/dialog/DialogTitle';
import styles from './ErrorDialogMessage.module.css';
import classNames from "@utils/classNames";

const DATA_TEST_ID = 'error-details-test';

/** `isRateLimited`: the send was turned down for too many messages lately, so the dialog says that */
export default function ErrorDialogMeesage({
  details,
  isRateLimited = false,
}: {
  details: string;
  isRateLimited?: boolean;
}) {
  const t = useTranslations('errorDialog');

  return (
    <div className={styles.container}>
      <DialogTitle label={t('error')} />
      <p
        role='alert'
        className={styles.message}
      >
        {t(isRateLimited ? 'rateLimitedMessage' : 'errorMessage')}
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
