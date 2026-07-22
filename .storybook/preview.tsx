import type { Decorator, Preview } from "@storybook/nextjs";
import "../app/globals.css";
// Side-effect import: registers the next/font/local @font-face declarations
// that globals.css's font-family stack (Inter, JetBrains Mono, Big Shoulders)
// depends on by name. The exported FONTS_VARIABLES is unused/empty — the
// fonts are wired up purely by this module having been imported.
import "../app/utils/handleFonts";

const withMainLandmark: Decorator = (Story) => (
  <main style={{ padding: "2rem" }}>
    <Story />
  </main>
);

const preview: Preview = {
  parameters: {
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
    backgrounds: {
      default: "sky-deep",
      values: [{ name: "sky-deep", value: "#0a0e1a" }],
    },
    a11y: {
      test: "todo",
    },
  },
  decorators: [withMainLandmark],
};

export default preview;
