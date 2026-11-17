"use client";

import { useContext, useEffect, useRef } from "react";
import { STARS } from "@constants/sky";
import { SectionOnScreenContext } from "@ui/sectionBackground/PauseOffscreen";
import usePrefersReducedMotion from "@hooks/usePrefersReducedMotion";
import styles from "./SectionSky.module.css";

/** A small seeded random number generator (mulberry32): the same numbers every time */
function random(seed: number) {
  let state = seed;
  return () => {
    state = (state + 0x6d2b79f5) | 0;
    let t = Math.imul(state ^ (state >>> 15), 1 | state);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/** The stars, placed in a section's image, each with its own gentle circling */
function placeStars({ seed, starsTop, height }: Pick<SkyStarsProps, "seed" | "starsTop" | "height">) {
  const next = random(seed);
  const between = (min: number, max: number) => min + next() * (max - min);

  return STARS.map(([x, y, radius]) => {
    const duration = between(9, 20);
    return {
      x,
      y: starsTop + y,
      radius,
      /** The circle's radius, in the image's pixels */
      orbit: between(5, 10),
      duration,
      /** How far along its circle it already is, in seconds */
      start: between(0, duration),
      reversed: next() < 0.5,
    };
  }).filter(({ y, radius }) => y - radius < height);
}

interface SkyStarsProps {
  /** Seeds the stars' circling, so each section's sky moves its own way */
  seed: number;
  /** Where the stars' layer sat in the image: its top, at 1x */
  starsTop: number;
  /** The image's height at 1x: stars below it aren't seen */
  height: number;
  /** How opaque the stars were in the illustration */
  opacity: number;
}

/**
 * How often the stars are drawn again: they move a few pixels over several seconds, so 30 times a
 * second looks the same as every frame, at half the cost
 */
const FRAME_MS = 1000 / 30;

/**
 * A section's stars (see SectionSky), drawn on a canvas covering the frame, only while their section is
 * on screen. Each circles beside its place in the image (its circle's right edge): still, it's exactly
 * there. Drawn rather than a few hundred elements, each animated: the browser touched every one of them
 * each time it restyled the page (on every frame while scrolling), a good part of a phone's frame time.
 * With reduced motion, they stay as illustrated.
 */
export default function SkyStars({ opacity, ...props }: SkyStarsProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  // From the sky around it (see PauseOffscreen): drawn once known to be on screen
  const onScreen = useContext(SectionOnScreenContext) === true;
  const reducedMotion = usePrefersReducedMotion();
  // Recomputed only when the props change: the React Compiler memoizes it
  const stars = placeStars(props);

  useEffect(() => {
    const canvas = canvasRef.current;
    const context = canvas?.getContext("2d");
    if (!canvas || !context || !onScreen) {
      return;
    }

    /** The crop's width and offset into the image (see SectionSky.module.css), and image px to canvas px */
    let cropX = 0;
    let scale = 1;
    const measure = () => {
      const style = getComputedStyle(canvas);
      const cropWidth = parseFloat(style.getPropertyValue("--cw")) || 1728;
      cropX = ((1728 - cropWidth) / 2) * (parseFloat(style.getPropertyValue("--centered")) || 0);
      const ratio = window.devicePixelRatio || 1;
      canvas.width = Math.round(canvas.clientWidth * ratio);
      canvas.height = Math.round(canvas.clientHeight * ratio);
      scale = (canvas.clientWidth / cropWidth) * ratio;
    };

    const draw = (time: number) => {
      context.setTransform(1, 0, 0, 1, 0, 0);
      context.clearRect(0, 0, canvas.width, canvas.height);
      context.setTransform(scale, 0, 0, scale, -cropX * scale, 0);
      context.fillStyle = `rgb(153 153 153 / ${opacity})`;
      context.beginPath();
      stars.forEach(({ x, y, radius, orbit, duration, start, reversed }) => {
        const turn = reducedMotion ? 0 : ((time / 1000 + start) / duration) % 1;
        const angle = 2 * Math.PI * (reversed ? -turn : turn);
        const centerX = x - orbit + orbit * Math.cos(angle);
        const centerY = y + orbit * Math.sin(angle);
        context.moveTo(centerX + radius, centerY);
        context.arc(centerX, centerY, radius, 0, 2 * Math.PI);
      });
      context.fill();
    };

    let frame = 0;
    let last = -Infinity;
    const loop = (time: number) => {
      if (time - last >= FRAME_MS) {
        last = time;
        draw(time);
      }
      frame = requestAnimationFrame(loop);
    };
    const redraw = () => {
      measure();
      draw(performance.now());
    };

    redraw();
    if (!reducedMotion) {
      frame = requestAnimationFrame(loop);
    }
    const resizeObserver = typeof ResizeObserver === "undefined" ? null : new ResizeObserver(redraw);
    resizeObserver?.observe(canvas);

    return () => {
      cancelAnimationFrame(frame);
      resizeObserver?.disconnect();
    };
  }, [onScreen, reducedMotion, opacity, stars]);

  return <canvas ref={canvasRef} className={styles.stars} aria-hidden />;
}
