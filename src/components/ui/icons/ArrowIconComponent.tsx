import ArrowRightIcon from '@ui/icons/ArrowRightIcon';
import styles from './ArrowIconComponent.module.css';

export default function ArrowIconComponent() {
  return (
    <div className={styles.container}>
      <ArrowRightIcon
        fillClassName={styles.focusShadowFill}
        strokeClassName={styles.focusShadowStroke}
        className={styles.focusShadow}
      />
      <ArrowRightIcon
        fillClassName={styles.arrowFill}
        strokeClassName={styles.arrowStroke}
      />
    </div>
  );
}
