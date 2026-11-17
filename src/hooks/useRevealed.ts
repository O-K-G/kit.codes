import { useSyncExternalStore } from "react";
import { REVEALED_ATTRIBUTE, REVEALED_EVENT } from "@constants/loader";

const subscribe = (onChange: () => void) => {
  window.addEventListener(REVEALED_EVENT, onChange);
  return () => window.removeEventListener(REVEALED_EVENT, onChange);
};

const getSnapshot = () => document.documentElement.hasAttribute(REVEALED_ATTRIBUTE);

/** On the server, and while hydrating, not yet */
const getServerSnapshot = () => false;

/** Whether the page is in full view: the loader has faded out (see LoaderVisibility) */
export default function useRevealed() {
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}
