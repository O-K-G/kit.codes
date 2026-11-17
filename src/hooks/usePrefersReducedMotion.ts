import useMediaQuery from "@hooks/useMediaQuery";

/** Whether the user asks for reduced motion, kept up to date as the setting changes. On the server, and
 * while hydrating, it's taken as not asked for */
export default function usePrefersReducedMotion() {
  return useMediaQuery("(prefers-reduced-motion: reduce)");
}
