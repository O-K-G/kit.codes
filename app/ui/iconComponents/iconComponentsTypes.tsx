import { SVGProps } from "react";

// Claude PR: this only declared `className`, but every icon spreads its props directly
// onto an <svg> (see closeIcon.tsx, radioTowerIcon.tsx, etc.) and call sites were already
// passing aria-hidden to hide decorative icons from assistive tech — which only worked
// at runtime, not at the type level. Widening to SVGProps makes that (and any other valid
// SVG/ARIA attribute) actually type-checked.
export type IconProps = SVGProps<SVGSVGElement>;
