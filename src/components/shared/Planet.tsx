import { CACHE_VERSION } from "@root/postcss.config.mjs";
import { useTranslations } from "next-intl";
import styles from "./Planet.module.css";

export default function Planet() {
  const t = useTranslations("planet");

  return (
    <div className={styles.container}>
      <div className={styles.rotator}>
        <img
          className={styles.image}
          alt={t("alt")}
          src={`/images/planet.webp?cacheVersion=${CACHE_VERSION}`}
        />
      </div>
    </div>
  );
}
