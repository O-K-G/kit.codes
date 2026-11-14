import { CSSProperties } from "react";
import comet from "@/assets/images/about/comet.webp";
import { ABOUT_STARS } from "@constants/aboutStars";
import classNames from "@utils/classNames";
import PauseOffscreen from "@ui/sectionBackground/PauseOffscreen";
import styles from "./AboutSky.module.css";

/** The comet image's place in the scene, in the scene's pixels at 1x (it's cut from the 4x scene) */
const COMET = { x: 50, y: 42.5, width: 686.25, height: 345 };

/** The comet image's own coordinates (the 4x scene's pixels): its head, and the end of its tail */
const VIEW = { width: 2745, height: 1380 };
const HEAD = { x: 116, y: 1116 };
const TAIL_END = { x: 1494, y: 116 };

/**
 * Wisps of smoke left behind by the tail: each starts on the tail's smoky part and drifts on along it,
 * spreading and fading. [x, y] where it starts, in the comet image's coordinates; its start delay (s)
 */
const PUFFS: [number, number, number][] = [
  [960, 470, 0],
  [1080, 380, 1.6],
  [1200, 300, 3.2],
  [1320, 220, 4.8],
  [1030, 420, 6.4],
  [1260, 260, 8],
];

/**
 * The About background's animated parts, drawn over its image (inside SectionBackground's overlay,
 * which follows the image's scroll zoom): its comet, exactly as illustrated, whose tail wavers like
 * smoke and leaves wisps behind it, and its stars, each circling gently at its own pace. Both were
 * part of the illustration (they've been cut out of the image) and sit where they were in it.
 *
 * Decorative: hidden from screen readers. With reduced motion, they hold still; off screen, they pause.
 */
export default function AboutSky() {
  return (
    <PauseOffscreen className={styles.frame}>
      <svg
        className={styles.comet}
        viewBox={`0 0 ${VIEW.width} ${VIEW.height}`}
        style={
          {
            "--x": COMET.x,
            "--y": COMET.y,
            "--width": COMET.width,
            "--height": COMET.height,
          } as CSSProperties
        }
      >
        <defs>
          {/* Along the comet, from its head to its tail's end: the straight beam stays still, the
           * smoky part beyond it moves (the two blend over a short stretch) */}
          {[
            ["still", "#fff", "#000"],
            ["moving", "#000", "#fff"],
          ].map(([part, from, to]) => (
            <linearGradient
              key={part}
              id={`about-comet-${part}-along`}
              gradientUnits="userSpaceOnUse"
              x1={HEAD.x}
              y1={HEAD.y}
              x2={TAIL_END.x}
              y2={TAIL_END.y}
            >
              <stop offset="0.45" stopColor={from} />
              <stop offset="0.62" stopColor={to} />
            </linearGradient>
          ))}
          {["still", "moving"].map((part) => (
            <mask key={part} id={`about-comet-${part}`} maskUnits="userSpaceOnUse">
              <rect width={VIEW.width} height={VIEW.height} fill={`url(#about-comet-${part}-along)`} />
            </mask>
          ))}
          {/* Smoke: the tail is shifted by a slowly changing noise, so it wavers and curls */}
          <filter
            id="about-comet-smoke"
            filterUnits="userSpaceOnUse"
            x="600"
            y="-120"
            width="1400"
            height="900"
          >
            <feTurbulence type="fractalNoise" baseFrequency="0.005 0.011" numOctaves="2" seed="4">
              <animate
                attributeName="baseFrequency"
                dur="12s"
                values="0.005 0.011;0.007 0.015;0.005 0.011"
                repeatCount="indefinite"
              />
            </feTurbulence>
            <feDisplacementMap in="SourceGraphic" scale="28" xChannelSelector="R" yChannelSelector="G" />
          </filter>
          <radialGradient id="about-comet-puff">
            <stop offset="0" stopColor="rgb(255 150 174)" stopOpacity="0.16" />
            <stop offset="1" stopColor="rgb(255 150 174)" stopOpacity="0" />
          </radialGradient>
        </defs>

        <image href={comet.src} width={VIEW.width} height={VIEW.height} mask="url(#about-comet-still)" />
        <g mask="url(#about-comet-moving)">
          <image
            className={styles.smoke}
            href={comet.src}
            width={VIEW.width}
            height={VIEW.height}
          />
        </g>
        {PUFFS.map(([cx, cy, delay]) => (
          <circle
            key={`${cx}-${cy}`}
            className={styles.puff}
            cx={cx}
            cy={cy}
            r="70"
            fill="url(#about-comet-puff)"
            style={{ "--delay": `${-delay}s` } as CSSProperties}
          />
        ))}
      </svg>

      {/* Each star turns with its circle (its orbit), whose right edge it sits on: still, the star is
       * exactly at its place in the image; turning, it circles beside it */}
      {ABOUT_STARS.map(([x, y, radius, orbit, duration, delay, reversed]) => (
        <span
          key={`${x}-${y}`}
          className={classNames(styles.orbit, reversed && styles.reversed)}
          style={
            {
              "--x": x,
              "--y": y,
              "--r": radius,
              "--orbit": orbit,
              "--duration": `${duration}s`,
              "--delay": `${delay}s`,
            } as CSSProperties
          }
        >
          <span className={styles.star} />
        </span>
      ))}
    </PauseOffscreen>
  );
}
