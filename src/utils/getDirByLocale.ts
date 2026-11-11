import { GetDirByLocaleProps } from '@constants/interfaces';
import { DIRECTION_BY_LANGUAGE } from '@constants/LocaleDirection';

export default function getDirByLocale({ locale }: GetDirByLocaleProps) {
  return DIRECTION_BY_LANGUAGE[locale as keyof typeof DIRECTION_BY_LANGUAGE];
}
