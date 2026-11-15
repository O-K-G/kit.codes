import { useTranslations } from 'next-intl';
import FixedBottomComponent from '@components/projects/FixedBottomComponent';
import ArrowUpIcon from '@components/projects/ArrowUpIcon';
import styles from './ScrollToTopComponent.module.css';

export default function ScrollToTopComponent() {
  const t = useTranslations('scrollToTopText');

  return (
    <FixedBottomComponent
      showOnScroll
      className={styles.position}
      label={t('scrollToTop')}
    >
      {/* "#top" scrolls to the top of the document; the smooth scrolling comes from globals.css */}
      <a href="#top" aria-label={t('scrollToTop')}>
        <ArrowUpIcon />
      </a>
    </FixedBottomComponent>
  );
}
