import { useCallback, useSyncExternalStore } from "react";

/** On the server, and while hydrating, a media query is taken as not matching */
const getServerSnapshot = () => false;

/** Whether the media query matches, kept up to date as it changes (false where there's no matchMedia) */
export default function useMediaQuery(query: string) {
  const subscribe = useCallback(
    (onChange: () => void) => {
      const list = window.matchMedia?.(query);
      list?.addEventListener?.("change", onChange);
      return () => list?.removeEventListener?.("change", onChange);
    },
    [query]
  );
  const getSnapshot = useCallback(() => !!window.matchMedia?.(query).matches, [query]);

  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}
