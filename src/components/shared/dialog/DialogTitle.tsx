import IconButton from '@components/shared/IconButton';
import CloseIcon from '@components/icons/CloseIcon';
import { useTranslations } from 'next-intl';
import { DialogTitleProps } from '@constants/interfaces';
import styles from './DialogTitle.module.css';

export default function DialogTitle({
  label,
  onClick,
  className = '',
  closeButtonIcon = (
    <CloseIcon className={styles.closeIcon} />
  ),
}: DialogTitleProps) {
  const t = useTranslations('dialogComponentText');

  return (
    <div className={`${styles.container} ${className}`}>
      <h2 className={styles.title}>{label}</h2>
      <div className={styles.actions}>
        <IconButton
          aria-label={t('close')}
          onClick={onClick}
          className={styles.closeButton}
          icon={closeButtonIcon}
        />
      </div>
    </div>
  );
}
