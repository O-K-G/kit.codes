import { AnchorLinkProps, SideLinksProps } from '@constants/interfaces';
import GHIcon from '@ui/icons/GHIcon';
import LIIcon from '@ui/icons/LIIcon';
import { URLs } from '@constants/urls';
import { useTranslations } from 'next-intl';
import ChangeLanguage from '@ui/changeLanguage/ChangeLanguage';
import DownloadButton from '@ui/downloadButton/DownloadButton';
import styles from './SideLinks.module.css';

export const GH_TEST_ID = 'gh-test';
export const LI_TEST_ID = 'li-test';

function AnchorLink({
  url,
  icon,
  isRounded,
  ...rest
}: AnchorLinkProps) {
  return (
    <li data-rounded={isRounded} className={styles.listItem}>
      <a
        data-rounded={isRounded}
        href={url}
        rel="noreferrer"
        target="_blank"
        {...rest}
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
          icon={<GHIcon />}
        />
        <AnchorLink
          data-testid={LI_TEST_ID}
          aria-label={t('liLinkAriaLabel')}
          url={URLs.linkedIn}
          icon={<LIIcon />}
        />
        {!hideChangeLanguageButton && (
          <li>
            <ChangeLanguage />
          </li>
        )}
        <li>
          <DownloadButton />
        </li>
      </ul>
    </nav>
  );
}
