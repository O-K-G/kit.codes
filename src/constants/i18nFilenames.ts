export const i18nFilenames = [
  'about',
  'experience',
  'inputComponentText',
  'timelineText',
  'scrollToTopText',
  'shenanigansText',
  'skills',
  'sideLinks',
  'planet',
  'languageSelect',
  'scrollIconText',
  'reviews',
  'attributionText',
  'contact',
  'contactGoBackButtonText',
  'dialogComponentText',
  'errorDialog',
  'error',
];

/**
 * The namespaces client components read (directly, or as components a client component renders): the
 * only ones sent to the browser. The rest are only rendered on the server, so they stay out of the page.
 * A client component reading a namespace missing here would show its key instead of its text.
 */
export const CLIENT_NAMESPACES = [
  "attributionText",
  "contact",
  "dialogComponentText",
  "error",
  "errorDialog",
  "inputComponentText",
  "languageSelect",
  "shenanigansText",
  "timelineText",
] as const;
