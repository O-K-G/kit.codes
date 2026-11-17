import { IconsProps } from '@constants/interfaces';
import styles from './CloseIcon.module.css';
import classNames from "@utils/classNames";

export default function CloseIcon({ className }: IconsProps) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 -960 960 960"
      className={classNames(styles.icon, className)}
    >
      <path d="m256-200-56-56 224-224-224-224 56-56 224 224 224-224 56 56-224 224 224 224-56 56-224-224-224 224Z" />
    </svg>
  );
}
