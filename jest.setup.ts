import '@testing-library/jest-dom';

/* jsdom doesn't implement getComputedStyle's pseudo-element argument: it logs a "Not implemented"
 * error for each call (e.g. useEasedScrollLight reads the timeline's ::before). Without it, the
 * element's own style is returned: jsdom computes no layout either way. (Suites in the node
 * environment have no window.) */
if (typeof window !== 'undefined') {
  const getComputedStyle = window.getComputedStyle.bind(window);
  window.getComputedStyle = (element: Element) => getComputedStyle(element);
}
