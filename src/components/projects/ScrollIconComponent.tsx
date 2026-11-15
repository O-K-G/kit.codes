import { useTranslations } from 'next-intl';
import FixedBottomComponent from '@components/projects/FixedBottomComponent';
import DoubleArrowIcon from '@components/projects/DoubleArrowIcon';
import styles from './ScrollIconComponent.module.css';

export default function ScrollIconComponent() {
  const t = useTranslations('scrollIconText');

  return (
    <FixedBottomComponent
      hideOnScroll
      label={t('scroll')}
      slot={
        <DoubleArrowIcon className={styles.icon} />
      }
    />
  );
}
