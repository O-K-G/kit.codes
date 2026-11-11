import { ArrowRightIconProps } from '@constants/interfaces';
import styles from './ArrowRightIcon.module.css';

export default function ArrowRightIcon({
  className = '',
  strokeClassName = '',
  fillClassName = '',
}: ArrowRightIconProps) {
  return (
    <svg
      viewBox="0 0 54 105"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`${styles.icon} ${className}`}
    >
      <path
        className={strokeClassName}
        d="M1.30141 0V1.6063M1.30141 1.6063V102L51.6028 51.8031L1.30141 1.6063Z"
        strokeWidth="2"
      />
      <path
        className={fillClassName}
        d="M43.2192 51.5611L7.5891 86.6301V16.4921L43.2192 51.5611Z"
      />
      <path
        className={strokeClassName}
        d="M7.5891 15.3699V16.4921M7.5891 16.4921V86.6301L43.2192 51.5611L7.5891 16.4921Z"
        strokeWidth="2"
      />
    </svg>
  );
}
