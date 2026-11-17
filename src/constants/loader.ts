/** Marks the images the loader waits for before revealing the page (the ones on the first screen). */
export const LOADER_CRITICAL_IMAGE_ATTRIBUTE = "data-loader-critical";

/** Marks lazy images the loader starts fetching once the critical ones are ready,
 * so they don't compete with the first screen for bandwidth, but are in place before they're scrolled to. */
export const LOADER_DEFERRED_IMAGE_ATTRIBUTE = "data-loader-deferred";

/** Set on <html> once the loader has faded out, the page in full view (see LoaderVisibility): the intro
 * animations wait for it (see useRevealed, and the CSS holding them until then), rather than playing out
 * unseen under the loader while the page is still loading */
export const REVEALED_ATTRIBUTE = "data-revealed";

/** Fired on window as REVEALED_ATTRIBUTE is set */
export const REVEALED_EVENT = "site-revealed";
