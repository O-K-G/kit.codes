import type { Meta, StoryObj } from "@storybook/nextjs";
import AlignLeftIcon from "@ui/iconComponents/alignLeftIcon";

const meta = {
  title: "UI/Icons/AlignLeftIcon",
  component: AlignLeftIcon,
} satisfies Meta<typeof AlignLeftIcon>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    // The component hardcodes fill="currentFill" (not a real SVG/CSS
    // keyword) before spreading props, so an explicit fill is required to
    // actually see the icon — same workaround alignLeftIcon.test.tsx uses.
    width: 32,
    height: 32,
    fill: "#e8eaf0",
  },
};
