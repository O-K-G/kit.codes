import { useTranslations } from 'next-intl';
import { useFormStatus } from 'react-dom';
import ProgressIcon from '@components/contactForm/ProgressIcon';
import formValidation from '@utils/formValidation';
import styles from './ProgressIndicators.module.css';

export default function ProgressIndicators({
  isMessageSent,
}: {
  isMessageSent: boolean;
}) {
  const { pending: isLoading, data } = useFormStatus();
  const t = useTranslations('inputComponentText');
  const { isValidated } = formValidation({
    email: data?.get('email') as string,
    subject: data?.get('subject') as string,
    content: data?.get('content') as string,
  });

  return (
    <div className={styles.container}>
      <div className={styles.srOnly} aria-live="assertive" role="status">
        {isValidated && isLoading ? t('sendingMessage') : ''}
        {isMessageSent ? t('messageSent') : ''}
      </div>

      <ProgressIcon
        data-loading={isLoading}
        className={styles.spinner}
      />

      <div
        data-sent={isMessageSent}
        aria-hidden
        className={styles.sentMessage}
      >
        {t('messageSent')}
      </div>
    </div>
  );
}
