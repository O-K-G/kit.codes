import { useEffect, useState } from "react";

/** How long typing a letter takes: a base, plus up to as much again at random, as a person types */
const LETTER_MS = 30;
const LETTER_JITTER_MS = 30;
/** The pause once a text is typed, before the next one starts */
const PAUSE_MS = 2000;
/** Once the last text is typed, how long they all stay before they're cleared */
const LINGER_MS = 4000;
/** Once cleared, how long until the typing starts over: the clearing (TYPEWRITER_CLEAR_MS, for the
 * page to fade them out in) and a moment empty */
export const TYPEWRITER_CLEAR_MS = 300;
const EMPTY_MS = 2000;

/**
 * Types `texts` out one after another, letter by letter, while `running`: the text being typed and how
 * many of its letters are; after each text a pause, then the next one. Once the last one is typed, they
 * all stay for a while, then they're cleared (`cleared`, for the page to hide them), and after a moment
 * the typing starts over from the first one, endlessly. Stopped (`running` false), it holds where it is.
 */
export default function useTypewriter(texts: readonly string[], running: boolean) {
  const [current, setCurrent] = useState(0);
  const [typed, setTyped] = useState(0);
  const [cleared, setCleared] = useState(false);

  useEffect(() => {
    if (!running) {
      return;
    }

    let timeout: ReturnType<typeof setTimeout>;
    if (cleared) {
      timeout = setTimeout(() => {
        setCurrent(0);
        setTyped(0);
        setCleared(false);
      }, TYPEWRITER_CLEAR_MS + EMPTY_MS);
    } else if (typed < (texts[current]?.length ?? 0)) {
      timeout = setTimeout(() => setTyped(typed + 1), LETTER_MS + Math.random() * LETTER_JITTER_MS);
    } else if (current < texts.length - 1) {
      timeout = setTimeout(() => {
        setCurrent(current + 1);
        setTyped(0);
      }, PAUSE_MS);
    } else {
      timeout = setTimeout(() => setCleared(true), LINGER_MS);
    }
    return () => clearTimeout(timeout);
  }, [running, texts, current, typed, cleared]);

  return { current, typed, cleared, done: typed >= (texts[current]?.length ?? 0) };
}
