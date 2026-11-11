import { FixedBottomComponentProps } from '@constants/interfaces';
import styles from './FixedBottomComponent.module.css';

export default function FixedBottomComponent({
  label,
  slot,
  className = styles.defaultPosition,
  children,
  hideOnScroll,
  showOnScroll,
}: FixedBottomComponentProps) {
  return (
    <div
      data-hide-on-scroll={hideOnScroll}
      data-show-on-scroll={showOnScroll}
      className={`${styles.container} ${className}`}
    >
      <div className={styles.label}>
        {label}
      </div>
      {children ?? (
        <div className={styles.slotFrame}>
          {slot}
        </div>
      )}
    </div>
  );
}
