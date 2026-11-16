"use client";

import { useEffect, useState } from "react";
import { TimestampProps } from "@constants/interfaces";

/** How many seconds the timestamp counts up to (99:59) before it starts over from 00:00 */
const CYCLE_SECONDS = 100 * 60;

/** The time as "TTI mm:ss", starting over from 00:00 after 99:59 */
const format = (elapsedSeconds: number) => {
  const seconds = elapsedSeconds % CYCLE_SECONDS;
  return `TTI ${String(Math.floor(seconds / 60)).padStart(2, "0")}:${String(seconds % 60).padStart(2, "0")}`;
};

/**
 * The time since `since`, as "TTI mm:ss", counting each second from the clock (timers drift); "TTI 00:00"
 * until it starts. Its own component, so its ticks redraw only it. A decorative readout: hidden from
 * screen readers, which would only hear it tick.
 */
export default function Timestamp({ since, paused, className }: TimestampProps) {
  const [elapsed, setElapsed] = useState(0);

  useEffect(() => {
    if (since === null || paused) {
      return;
    }
    const interval = setInterval(() => setElapsed(Math.floor((Date.now() - since) / 1000)), 1000);
    return () => clearInterval(interval);
  }, [since, paused]);

  return (
    <span aria-hidden className={className}>
      {format(elapsed)}
    </span>
  );
}
