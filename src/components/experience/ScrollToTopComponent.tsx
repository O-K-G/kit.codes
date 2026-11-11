import { useTranslations } from 'next-intl';
import FixedBottomComponent from '@components/experience/FixedBottomComponent';
import IconButton from '@ui/iconButton/IconButton';
import ArrowUpIcon from '@components/experience/ArrowUpIcon';
import styles from './ScrollToTopComponent.module.css';

export default function ScrollToTopComponent() {
  const t = useTranslations('scrollToTopText');

  return (
    <FixedBottomComponent
      showOnScroll
      className={styles.position}
      label={t('scrollToTop')}
    >
      <IconButton
        className={styles.button}
        aria-label={t('scrollToTop')}
        icon={
          <ArrowUpIcon className={styles.icon} />
        }
        onClick={() => {
          window.scrollTo({
            top: 0,
            left: 0,
            behavior: 'smooth',
          });
        }}
      />
    </FixedBottomComponent>
  );
}
