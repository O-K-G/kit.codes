/**
 * Prints the keyframes of ExpandableContent's opening (see ExpandableContent.module.css), to paste over
 * the generated ones there: run it again if --open-easing changes.
 *
 * The text shows between two lines that close in and part linearly over the box's height, while the box
 * grows, eased: the lines' distance is the product of the two, which no single transition follows. So
 * it's sampled every STEP: at each, the distance is h * (the closed square * (1 - e) + the box * e), h
 * the lines' linear share (1 to 0 to 1), e the box's eased progress; each line is half the rest from its
 * edge. Percentages are of the box's height.
 *
 *   node scripts/generate-expand-keyframes.mjs
 */

/** --open-easing */
const EASING = [0.4, 0, 0.2, 1];
/** Between samples, in % of the opening */
const STEP = 5;

/** A cubic-bezier timing function's value at `t` (solved by bisection: it's monotonic in x) */
function cubicBezier([x1, y1, x2, y2], t) {
  const at = (a, b, u) => 3 * a * u * (1 - u) ** 2 + 3 * b * u ** 2 * (1 - u) + u ** 3;
  let low = 0;
  let high = 1;
  for (let i = 0; i < 60; i++) {
    const u = (low + high) / 2;
    if (at(x1, x2, u) < t) {
      low = u;
    } else {
      high = u;
    }
  }
  return at(y1, y2, (low + high) / 2);
}

const round = (value) => Number(value.toFixed(4));

/** How far each line is from its edge, at `t` of the opening */
function inset(t) {
  const e = cubicBezier(EASING, t);
  const h = Math.abs(1 - 2 * t);
  return `50% - (${round(h * (1 - e))} * var(--closed-size) + ${round(h * e)} * 100%) / 2`;
}

function keyframes(name, declarations) {
  const steps = [];
  for (let percent = 0; percent <= 100; percent += STEP) {
    const t = percent / 100;
    steps.push(`  ${percent}% {\n${declarations(t).map((line) => `    ${line};`).join("\n")}\n  }`);
  }
  return `@keyframes ${name} {\n${steps.join("\n\n")}\n}`;
}

console.log(
  [
    keyframes("expand-button", (t) => [`clip-path: inset(calc(${inset(t)}) 0)`]),
    keyframes("frame-line", (t) => [
      `opacity: ${Math.round(Math.min(1, 2 * t) * 100)}%`,
      `translate: 0 calc(var(--line-direction) * (${inset(t)}))`,
    ]),
  ].join("\n\n")
);
