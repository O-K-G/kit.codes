import { IconProps } from "@ui/iconComponents/iconComponentsTypes";
import styles from "./radioTowerIcon.module.css"; // Ensure this path matches your directory structure

export default function RadioTowerIcon(props: IconProps) {
  return (
    <svg
      xmlns="http://w3.org"
      viewBox="0 -960 960 960"
      className={styles.icon}
      {...props}
    >
      <path
        className={styles.outerBars}
        fill="currentFill"
        d="M196-276q-57-60-86.5-133T80-560q0-78 29.5-151T196-844l48 48q-48 48-72 110.5T148-560q0 63 24 125.5T244-324l-48 48Zm568 0-48-48q48-48 72-110.5T812-560q0-63-24-125.5T716-796l48-48q57 60 86.5 133T880-560q0 78-28 151t-88 133Z"
      />

      <path
        className={styles.innerBars}
        fill="currentFill"
        d="M292-372q-39-39-59.5-88T212-560q0-51 20.5-100t59.5-88l48 48q-30 27-45 64t-15 76q0 36 15 73t45 67l-48 48Zm376 0-48-48q30-27 45-64t15-76q0-36-15-73t-45-67l48-48q39 39 58 88t22 100q0 51-20.5 100T668-372Z"
      />

      <path
        className={styles.tower}
        fill="currentFill"
        d="M280-80l135-405q-16-14-25.5-33t-9.5-42q0-42 29-71t71-29q42 0 71 29t29 71q0 23-9.5 42T545-485L680-80h-80l-26-80H387l-27 80h-80Zm133-160h134l-67-200-67 200Z"
      />
    </svg>
  );
}
