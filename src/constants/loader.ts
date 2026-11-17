/** Marks the images the loader waits for before revealing the page (the ones on the first screen). */
export const LOADER_CRITICAL_IMAGE_ATTRIBUTE = "data-loader-critical";

/** Marks lazy images the loader starts fetching once the critical ones are ready,
 * so they don't compete with the first screen for bandwidth, but are in place before they're scrolled to. */
export const LOADER_DEFERRED_IMAGE_ATTRIBUTE = "data-loader-deferred";
