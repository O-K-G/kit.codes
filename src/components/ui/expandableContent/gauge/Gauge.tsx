"use client";

import { useEffect, useRef } from "react";
import { GaugeProps } from "@constants/interfaces";
import usePrefersReducedMotion from "@hooks/usePrefersReducedMotion";
import styles from "./Gauge.module.css";
import classNames from "@utils/classNames";

/** When each part is done, in ms from the start: the inner ring and the count, then the outer ring */
const COUNT_MS = 800;
const OUTER_MS = 1200;
/** The count's text blinks (disappears) twice once it's at 100%, 0.4s each, then the gauge is done */
const BLINK_MS = 400;
const DONE_MS = COUNT_MS + 2 * BLINK_MS;
/** The glow's swell, one way (it goes back and forth) */
const PULSE_MS = 600;

const PURPLE = "#ceb7ff";
const GLOW_PURPLE = "#b377ff";
/** oklch(63.7% 0.237 25.331) and oklch(75% 0.183 55.934), in sRGB for the canvas */
const RED = "#fb2c36";
const PALE_ORANGE = "#ff8904";

/** The rings, as fractions of the gauge's radius: the outer one's inner edge; the inner one's outer and
 * inner edges (in a box inset by 9.75%, a small gap inside the outer ring) */
const OUTER_INNER_EDGE = 0.86;
const INNER_OUTER_EDGE = 1 - 2 * 0.0975;
const INNER_INNER_EDGE = INNER_OUTER_EDGE * 0.841;
/** The inner ring's 20 segments: each 18deg, ending in a 2deg gap; corners rounded by 2% of its radius */
const SEGMENTS = 20;
const SEGMENT_DEG = 360 / SEGMENTS;
const SEGMENT_GAP_DEG = 2;
const SEGMENT_CORNER = 0.02;

const clamp01 = (value: number) => Math.min(Math.max(value, 0), 1);
const toRadians = (degrees: number) => (degrees * Math.PI) / 180;
/** From the top, clockwise */
const fromTop = (degrees: number) => toRadians(degrees - 90);
/** ease-in-out, close enough for a glow's swell */
const easeInOut = (t: number) => t * t * (3 - 2 * t);

/** Mixes two #rrggbb colors */
function mix(from: string, to: string, amount: number) {
  const channel = (hex: string, index: number) => parseInt(hex.slice(1 + 2 * index, 3 + 2 * index), 16);
  const value = [0, 1, 2].map((index) =>
    Math.round(channel(from, index) + (channel(to, index) - channel(from, index)) * amount)
  );
  return `rgb(${value.join(" ")})`;
}

/** A ring's shape, from `inner` to `outer` radius, up to `degrees` from the top (the full ring by default) */
function ringPath(context: CanvasRenderingContext2D, center: number, inner: number, outer: number, degrees = 360) {
  context.beginPath();
  context.arc(center, center, outer, fromTop(0), fromTop(degrees));
  context.arc(center, center, inner, fromTop(degrees), fromTop(0), true);
  context.closePath();
}

/** The inner ring's segments, each drawn 2 corner-widths smaller then stroked with round joins, which
 * grows it back to the ring's size with its corners rounded */
function segmentsPath(context: CanvasRenderingContext2D, center: number, radius: number) {
  const corner = SEGMENT_CORNER * radius;
  const outer = INNER_OUTER_EDGE * radius - corner;
  const inner = INNER_INNER_EDGE * radius + corner;
  context.beginPath();
  for (let index = 0; index < SEGMENTS; index++) {
    const start = index * SEGMENT_DEG;
    const end = start + SEGMENT_DEG - SEGMENT_GAP_DEG;
    // Shrunk by the corner at either end, along the outer edge (as the original's segments are)
    const inset = (corner / outer) * (180 / Math.PI);
    context.moveTo(center + inner * Math.cos(fromTop(start + inset)), center + inner * Math.sin(fromTop(start + inset)));
    context.arc(center, center, outer, fromTop(start + inset), fromTop(end - inset));
    context.arc(center, center, inner, fromTop(end - inset), fromTop(start + inset), true);
    context.closePath();
  }
}

/** A wedge from the top, clockwise, over `degrees`: what's filled so far */
function wedgePath(context: CanvasRenderingContext2D, center: number, radius: number, degrees: number) {
  context.beginPath();
  context.moveTo(center, center);
  context.arc(center, center, radius, fromTop(0), fromTop(degrees));
  context.closePath();
}

/** The two fills, from the top: the outer ring's, `outer` degrees of it, and the inner ring's
 * segments, `inner` degrees of them, in the given style (a color or a gradient) */
function drawFills(
  context: CanvasRenderingContext2D,
  size: number,
  outer: number,
  inner: number,
  innerStyle: CanvasFillStyle
) {
  const center = size / 2;
  if (outer > 0) {
    const outerGradient = context.createConicGradient(fromTop(0), center, center);
    outerGradient.addColorStop(0, PURPLE);
    outerGradient.addColorStop(1, RED);
    ringPath(context, center, OUTER_INNER_EDGE * center, center, outer);
    context.fillStyle = outerGradient;
    context.fill();
  }
  if (inner > 0) {
    context.save();
    wedgePath(context, center, center, inner);
    context.clip();
    segmentsPath(context, center, center);
    context.fillStyle = innerStyle;
    context.strokeStyle = innerStyle;
    context.lineWidth = 2 * SEGMENT_CORNER * center;
    context.lineJoin = "round";
    context.fill();
    context.stroke();
    context.restore();
  }
}

type CanvasFillStyle = string | CanvasGradient;

/**
 * A decorative gauge that fills by itself: an outer ring (purple to red), a segmented inner ring
 * (white to pale orange, glowing red) and a count to 100% in the middle. As the count hits 100% it calls
 * `onFull` (so others can blink along), and once the count has blinked twice, `onComplete`. It fills its
 * parent; pass a `className` to size and place it.
 *
 * Drawn on a canvas, at every frame while it runs: its rings filling were masks redrawn at every frame
 * by the browser, with a blurred glow worked out again over them, too much for a phone along with the
 * rest of the page. Pauses where it is while not `running`; done, it stops drawing.
 *
 * Accessibility: hidden from screen readers. It lasts 1.6s, under 5 seconds (WCAG 2.2.2); its blinks are
 * 2 in 0.8s and its glow swells under twice a second (under WCAG 2.3.1's 3 flashes a second). With
 * reduced motion it completes as soon as it runs, still calling `onFull` and `onComplete`.
 */
export default function Gauge({ running, onFull, onComplete, className, ref }: GaugeProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const reducedMotion = usePrefersReducedMotion();
  /** How long it has run, across pauses */
  const elapsedRef = useRef(0);
  const firedRef = useRef({ full: false, complete: false });
  // The latest callbacks, without restarting the animation when they change
  const callbacksRef = useRef({ onFull, onComplete });
  useEffect(() => {
    callbacksRef.current = { onFull, onComplete };
  });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) {
      return;
    }
    const context = canvas.getContext?.("2d") ?? null;
    /** The glow's layer: the fills, blurred and brightened as they're drawn onto the gauge. Not where the
     * canvas can't blur (older Safari): unblurred, it would be a hard copy of the rings */
    const glow = context && "filter" in context ? document.createElement("canvas") : null;
    const glowContext = glow?.getContext?.("2d") ?? null;

    /** In device px: the gauge, and the canvas around it */
    let size = 0;
    let full = 0;
    let ratio = 1;
    /** In CSS px (see Gauge.module.css): the glow's blur, and the count's */
    let glowBlur = 0;
    let countBlur = 0;
    let font = "sans-serif";
    const measure = () => {
      if (!context) {
        return;
      }
      ratio = window.devicePixelRatio || 1;
      // The gauge's size, and the canvas', which has room around it for the glow (see Gauge.module.css)
      const gauge = canvas.parentElement ?? canvas;
      size = Math.round(Math.min(gauge.clientWidth, gauge.clientHeight) * ratio);
      full = Math.round(Math.min(canvas.clientWidth, canvas.clientHeight) * ratio);
      canvas.width = full;
      canvas.height = full;
      if (glow) {
        glow.width = full;
        glow.height = full;
      }
      const style = getComputedStyle(canvas);
      glowBlur = parseFloat(style.getPropertyValue("--gauge-glow-blur")) || 10;
      countBlur = parseFloat(style.getPropertyValue("--gauge-count-blur")) || 5;
      font = style.fontFamily || font;
    };

    const draw = (elapsed: number) => {
      if (!context || !size) {
        return;
      }
      const center = size / 2;
      /** The room around the gauge: everything's drawn in the gauge's coordinates, moved by it */
      const room = (full - size) / 2;
      const outer = 360 * clamp01(elapsed / OUTER_MS);
      const countProgress = clamp01(elapsed / COUNT_MS);
      const inner = 360 * countProgress;
      context.setTransform(1, 0, 0, 1, 0, 0);
      context.clearRect(0, 0, full, full);
      context.translate(room, room);

      // The outer ring's faint track, then its fill
      ringPath(context, center, OUTER_INNER_EDGE * center, center);
      context.fillStyle = "rgb(255 255 255 / 20%)";
      context.fill();
      drawFills(context, size, outer, 0, "");

      // The glow: the fills (the inner one in red), blurred and brightened, swelling back and forth
      if (glow && glowContext) {
        glowContext.setTransform(1, 0, 0, 1, 0, 0);
        glowContext.clearRect(0, 0, full, full);
        glowContext.translate(room, room);
        drawFills(glowContext, size, outer, inner, RED);
        const swing = (elapsed / PULSE_MS) % 2;
        const pulse = easeInOut(swing < 1 ? swing : 2 - swing);
        const scale = 1 + 0.04 * pulse;
        context.save();
        context.globalAlpha = 0.7 + 0.3 * pulse;
        context.filter = `blur(${glowBlur * ratio}px) brightness(2)`;
        context.setTransform(1, 0, 0, 1, full / 2, full / 2);
        context.scale(scale, scale);
        context.drawImage(glow, -full / 2, -full / 2);
        context.restore();
      }

      // The inner ring: its black ground, its faint segments, and its fill
      ringPath(context, center, INNER_INNER_EDGE * center, INNER_OUTER_EDGE * center);
      context.fillStyle = "#000";
      context.fill();
      segmentsPath(context, center, center);
      context.fillStyle = "rgb(255 255 255 / 20%)";
      context.strokeStyle = "rgb(255 255 255 / 20%)";
      context.lineWidth = 2 * SEGMENT_CORNER * center;
      context.lineJoin = "round";
      context.fill();
      context.stroke();
      const innerGradient = context.createConicGradient(fromTop(0), center, center);
      innerGradient.addColorStop(0, "#fff");
      innerGradient.addColorStop(1, PALE_ORANGE);
      drawFills(context, size, 0, inner, innerGradient);

      // The count, white to purple as it counts, with the subtitles' neon glow; it blinks off for the
      // first half of each of its two blinks
      const blinking = elapsed >= COUNT_MS && elapsed < DONE_MS;
      if (!blinking || (elapsed - COUNT_MS) % BLINK_MS >= BLINK_MS / 2) {
        context.save();
        context.font = `800 ${0.14 * size}px ${font}`;
        context.textAlign = "center";
        context.textBaseline = "middle";
        context.fillStyle = mix("#ffffff", PURPLE, countProgress);
        context.shadowColor = GLOW_PURPLE;
        context.shadowBlur = countBlur * ratio;
        context.fillText(`${Math.round(100 * countProgress)}%`, center, center);
        context.restore();
      }
    };

    /** Reports reaching 100% and being done, once each */
    const report = (elapsed: number) => {
      if (elapsed >= COUNT_MS && !firedRef.current.full) {
        firedRef.current.full = true;
        callbacksRef.current.onFull?.();
      }
      if (elapsed >= DONE_MS && !firedRef.current.complete) {
        firedRef.current.complete = true;
        callbacksRef.current.onComplete?.();
      }
    };

    measure();
    if (running && reducedMotion) {
      elapsedRef.current = Math.max(elapsedRef.current, DONE_MS);
    }
    draw(elapsedRef.current);
    report(elapsedRef.current);

    const resizeObserver = typeof ResizeObserver === "undefined" ? null : new ResizeObserver(() => {
      measure();
      draw(elapsedRef.current);
    });
    resizeObserver?.observe(canvas);

    let frame = 0;
    if (running && !reducedMotion) {
      let last: number | null = null;
      const step = (time: number) => {
        elapsedRef.current += last === null ? 0 : time - last;
        last = time;
        draw(elapsedRef.current);
        report(elapsedRef.current);
        frame = requestAnimationFrame(step);
      };
      frame = requestAnimationFrame(step);
    }

    return () => {
      cancelAnimationFrame(frame);
      resizeObserver?.disconnect();
    };
  }, [running, reducedMotion]);

  return (
    <div ref={ref} aria-hidden data-running={running} className={classNames(styles.gauge, className)}>
      <canvas ref={canvasRef} className={styles.canvas} />
    </div>
  );
}
