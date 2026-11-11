import ScrollIconComponent from "@components/shared/ScrollIconComponent";
import Attribution from "@components/Attribution";
import Shenanigans from "@components/Shenanigans";
import Planet from "@components/shared/Planet";
import ScrollToTopComponent from "@components/shared/ScrollToTopComponent";
import useHandleScrollAnimationTimelinePolyfill from "@hooks/useHandleScrollAnimationTimelinePolyfill";
import styles from "./Footer.module.css";

export default function Footer() {
  /** In the future once Firefox and Safari fully support CSS' animation-timeline -
   * https://developer.mozilla.org/en-US/docs/Web/CSS/animation-timeline ,
   * it should be better to use it rather than this useHandleScrollAnimationTimelinePolyfill hook.
   */

  useHandleScrollAnimationTimelinePolyfill();

  return (
    <footer className={styles.footer}>
      <Planet />
      <ScrollIconComponent />
      <ScrollToTopComponent />
      <Attribution />
      <Shenanigans />
    </footer>
  );
}
