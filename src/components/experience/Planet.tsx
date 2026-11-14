import { getImageProps } from "next/image";
import { useTranslations } from "next-intl";
import planet from "@/assets/images/planet.webp";
import { LOADER_CRITICAL_IMAGE_ATTRIBUTE } from "@constants/loader";
import styles from "./Planet.module.css";

export default function Planet() {
  const t = useTranslations("planet");

  /** Peeks from the bottom of the first screen on every route, so the loader waits for it.
   * `unoptimized`: it's already displayed at (or above) its own resolution, so it's served as it is. */
  const { props: { alt, ...props } } = getImageProps({
    src: planet,
    alt: t("alt"),
    unoptimized: true,
    loading: "eager",
    fetchPriority: "high",
  });

  return (
    <div className={styles.container}>
      <div>
        <img alt={alt} {...props} {...{ [LOADER_CRITICAL_IMAGE_ATTRIBUTE]: true }} />
      </div>
    </div>
  );
}
