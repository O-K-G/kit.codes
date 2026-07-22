import type { Meta, StoryObj } from "@storybook/nextjs";
import IconButton from "@ui/iconButton/iconButton";
import CloseIcon from "@ui/iconComponents/closeIcon";

const meta = {
  title: "UI/IconButton",
  component: IconButton,
  argTypes: {
    variant: { control: "select", options: ["outline-paper", "fill-sky-deep"] },
  },
} satisfies Meta<typeof IconButton>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    "aria-label": "Close",
    variant: "outline-paper",
    circle: true,
    children: <CloseIcon width={20} height={20} fill="currentColor" />,
  },
};
