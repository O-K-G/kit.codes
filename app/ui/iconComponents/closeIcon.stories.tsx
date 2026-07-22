import type { Meta, StoryObj } from "@storybook/nextjs";
import CloseIcon from "@ui/iconComponents/closeIcon";

const meta = {
  title: "UI/Icons/CloseIcon",
  component: CloseIcon,
} satisfies Meta<typeof CloseIcon>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    // The component hardcodes fill="currentFill" (not a real SVG/CSS
    // keyword) before spreading props, so an explicit fill is required to
    // actually see the icon — same workaround closeIcon.test.tsx already
    // uses. Not "fixed" here since it's pre-existing component behavior.
    width: 32,
    height: 32,
    fill: "#e8eaf0",
  },
};
