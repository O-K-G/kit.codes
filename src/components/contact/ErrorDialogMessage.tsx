import { useTranslations } from 'next-intl';
import DialogTitle from '@ui/dialog/DialogTitle';
import styles from './ErrorDialogMessage.module.css';
import classNames from "@utils/classNames";

const DATA_TEST_ID = 'error-details-test';

/**
 * `isRateLimited`: the send was turned down for too many messages lately, so the dialog says that.
 * `messageId`: the message's id, for the dialog to be described by it (read out as it opens, along with
 * its title; a role="alert" in it would be read out again, or not at all, as it was already there)
 */
export default function ErrorDialogMeesage({
  details,
  isRateLimited = false,
  messageId,
}: {
  details: string;
  isRateLimited?: boolean;
  messageId?: string;
}) {
  const t = useTranslations('errorDialog');

  return (
    <div className={styles.container}>
      <DialogTitle label={t('error')} />
      <p
        id={messageId}
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
