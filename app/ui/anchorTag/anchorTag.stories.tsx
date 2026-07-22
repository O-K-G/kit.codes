import type { Meta, StoryObj } from "@storybook/nextjs";
import AnchorTag from "@ui/anchorTag/anchorTag";

const meta = {
  title: "UI/AnchorTag",
  component: AnchorTag,
} satisfies Meta<typeof AnchorTag>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    children: "View project",
    href: "https://example.com",
  },
};
