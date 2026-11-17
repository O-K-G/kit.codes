import LoaderVisibility from "@ui/loader/LoaderVisibility";
import { LoaderProps, LoaderTextProps } from "@constants/interfaces";
import { CACHE_VERSION } from "@constants/siteMetadata";
import styles from "./Loader.module.css";

export const LOADER_TEST_ID = "loader-test";

/** The site's app icon (the astronaut), at 2x its size on screen, or bigger for denser screens */
const ICON_SRC = `/images/astronaut-coding-laptop-app-icon-192x192.png?cacheVersion=${CACHE_VERSION}`;
const ICON_SRC_SET = `${ICON_SRC} 2x, /images/astronaut-coding-laptop-app-icon-512x512.png?cacheVersion=${CACHE_VERSION} 3x`;

function LoaderText({ label, slot }: LoaderTextProps) {
  if (label ?? slot) {
    return (
      <div className={styles.textContainer}>
        <div className={styles.text}>
          {label}
        </div>
        {slot}
      </div>
    );
  }
}

/**
 * Covers the page until it's ready (see LoaderVisibility): the site's icon, still, and an optional label.
 * Still rather than animated: while the page loads, the browser is at its busiest, and it skips frames
 * now and then (taking in the page, decoding its images); a spinner, followed by the eye, shows every one
 * of them, while a still icon has nothing to stutter.
 */
export default function Loader({
  open,
  label,
  loaderTextAdditionalSlot,
}: LoaderProps) {
  return (
    <LoaderVisibility open={open} className={styles.loader}>
      {/* Decorative. Fetched first thing (it's in the page's HTML), at high priority, and shown as it
       * comes: the loader is up before it */}
      <img
        data-testid={LOADER_TEST_ID}
        className={styles.icon}
        src={ICON_SRC}
        srcSet={ICON_SRC_SET}
        alt=""
        aria-hidden
        width={192}
        height={192}
        fetchPriority="high"
        decoding="async"
      />
      <LoaderText label={label} slot={loaderTextAdditionalSlot} />
    </LoaderVisibility>
  );
}
