'use client';

import { useContext } from 'react';
import IconButton from '@ui/iconButton/IconButton';
import CloseIcon from '@ui/icons/CloseIcon';
import { useTranslations } from 'next-intl';
import { DialogTitleProps } from '@constants/interfaces';
import { DialogContext } from '@ui/dialog/Dialog';
import classNames from '@utils/classNames';
import styles from './DialogTitle.module.css';

/** A dialog's title, which names it, and its close button (see Dialog) */
export default function DialogTitle({
  label,
  className,
  closeButtonIcon,
}: DialogTitleProps) {
  const t = useTranslations('dialogComponentText');
  const { titleId, onClose } = useContext(DialogContext);

  return (
    <div className={classNames(styles.container, className)}>
      <h2 id={titleId}>{label}</h2>
      <div>
        <IconButton aria-label={t('close')} icon={closeButtonIcon ?? <CloseIcon />} onClick={onClose} />
      </div>
    </div>
  );
}
