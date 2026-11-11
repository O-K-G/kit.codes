import { AnchorLinkProps, SideLinksProps } from '@constants/interfaces';
import GHIcon from '@components/icons/GHIcon';
import LIIcon from '@components/icons/LIIcon';
import { URLs } from '@constants/urls';
import { useTranslations } from 'next-intl';
import ChangeLanguage from '@components/shared/ChangeLanguage';
import DownloadButton from '@components/shared/DownloadButton';
import styles from './SideLinks.module.css';

export const GH_TEST_ID = 'gh-test';
export const LI_TEST_ID = 'li-test';

function AnchorLink({
  url,
  icon,
  isRounded,
  'aria-label': ariaLabel,
  'data-testid': dataTestId,
}: AnchorLinkProps) {
  return (
    <li data-rounded={isRounded} className={styles.listItem}>
      <a
        data-testid={dataTestId}
        data-rounded={isRounded}
        href={url}
        aria-label={ariaLabel}
        rel="noreferrer"
        target="_blank"
        className={styles.link}
      >
        {icon}
      </a>
    </li>
  );
}

export default function SideLinks({
  className = styles.nav,
  ulClassName = styles.list,
  hideChangeLanguageButton,
}: SideLinksProps) {
  const t = useTranslations('sideLinks');

  return (
    <nav aria-label={t('navAriaLabel')} className={className}>
      <ul className={ulClassName}>
        <AnchorLink
          isRounded
          data-testid={GH_TEST_ID}
          aria-label={t('ghLinkAriaLabel')}
          url={URLs.gitHub}
          icon={<GHIcon className={styles.icon} />}
        />
        <AnchorLink
          data-testid={LI_TEST_ID}
          aria-label={t('liLinkAriaLabel')}
          url={URLs.linkedIn}
          icon={<LIIcon className={styles.icon} />}
        />
        <ChangeLanguage hide={hideChangeLanguageButton} />
        <DownloadButton />
      </ul>
    </nav>
  );
}
