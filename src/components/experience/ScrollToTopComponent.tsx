import { useTranslations } from 'next-intl';
import FixedBottomComponent from '@components/experience/FixedBottomComponent';
import ScrollToTopButton from '@components/experience/ScrollToTopButton';
import styles from './ScrollToTopComponent.module.css';

export default function ScrollToTopComponent() {
  const t = useTranslations('scrollToTopText');

  return (
    <FixedBottomComponent
      showOnScroll
      className={styles.position}
      label={t('scrollToTop')}
    >
      <ScrollToTopButton label={t('scrollToTop')} />
    </FixedBottomComponent>
  );
}
