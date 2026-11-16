import { useSyncExternalStore } from "react";

const REDUCED_MOTION = "(prefers-reduced-motion: reduce)";

const subscribe = (onChange: () => void) => {
  const query = window.matchMedia?.(REDUCED_MOTION);
  query?.addEventListener?.("change", onChange);
  return () => query?.removeEventListener?.("change", onChange);
};

const getSnapshot = () => !!window.matchMedia?.(REDUCED_MOTION).matches;

/** On the server, and while hydrating, it's taken as not asked for */
const getServerSnapshot = () => false;

/** Whether the user asks for reduced motion, kept up to date as the setting changes */
export default function usePrefersReducedMotion() {
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}
