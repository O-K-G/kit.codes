import IconButton from '@ui/iconButton/IconButton';
import CloseIcon from '@ui/icons/CloseIcon';
import { useTranslations } from 'next-intl';
import { DialogTitleProps } from '@constants/interfaces';
import styles from './DialogTitle.module.css';

export default function DialogTitle({
  label,
  className = '',
  closeButtonIcon = (
    <CloseIcon />
  ),
  ...rest
}: DialogTitleProps) {
  const t = useTranslations('dialogComponentText');

  return (
    <div className={`${styles.container} ${className}`}>
      <h2>{label}</h2>
      <div>
        <IconButton
          aria-label={t('close')}
          icon={closeButtonIcon}
          {...rest}
        />
      </div>
    </div>
  );
}
