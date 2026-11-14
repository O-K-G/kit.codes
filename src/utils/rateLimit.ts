/**
 * Server-only: an in-memory, fixed-window rate limiter. Its counts live in this process, so it suits
 * the site's single, long-running Node server; behind several instances (or serverless), each
 * would count separately, and a shared store such as Redis would be needed instead.
 */

interface Window {
  count: number;
  resetAt: number;
}

interface RateLimiterOptions {
  /** How many hits each key gets per window */
  limit: number;
  windowMs: number;
  /** For tests: the current time in ms */
  now?: () => number;
}

/** Past this many keys, expired windows are swept out, so the map can't grow without bound */
const SWEEP_THRESHOLD = 1000;

export function createRateLimiter({ limit, windowMs, now = Date.now }: RateLimiterOptions) {
  const windows = new Map<string, Window>();

  function sweep(time: number) {
    windows.forEach((window, key) => {
      if (window.resetAt <= time) windows.delete(key);
    });
  }

  return {
    /** Counts a hit for `key`; false if it's over the limit (an over-limit hit isn't counted) */
    hit(key: string): boolean {
      const time = now();
      if (windows.size >= SWEEP_THRESHOLD) sweep(time);

      const window = windows.get(key);
      if (!window || window.resetAt <= time) {
        windows.set(key, { count: 1, resetAt: time + windowMs });
        return true;
      }
      if (window.count >= limit) return false;

      window.count += 1;
      return true;
    },
  };
}
