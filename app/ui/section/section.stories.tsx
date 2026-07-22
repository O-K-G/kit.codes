import type { Meta, StoryObj } from "@storybook/nextjs";
import Section from "@ui/section/section";
import Typography from "@ui/typography/typography";

const meta = {
  title: "UI/Section",
  component: Section,
} satisfies Meta<typeof Section>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    // A distinctive id avoids colliding with document.getElementById lookups
    // from any other mounted instance (e.g. on an autodocs page). Section
    // is fundamentally a scroll-triggered fade-in driven by a real
    // IntersectionObserver — this story only confirms it mounts/observes
    // without erroring, not a full scroll simulation.
    id: "storybook-section-demo",
    children: (
      <Typography component="h2" variant="section-heading">
        Section content
      </Typography>
    ),
  },
};
