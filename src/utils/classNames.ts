/**
 * Joins class names into one `className`, skipping the empty ones (undefined, null, false, ""), so
 * optional and conditional classes need no fallbacks:
 *   classNames(styles.button, isOpen && styles.open, className)
 */
export default function classNames(...names: Array<string | false | null | undefined>) {
  return names.filter(Boolean).join(" ");
}
