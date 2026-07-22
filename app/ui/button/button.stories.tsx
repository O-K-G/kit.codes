import type { Meta, StoryObj } from "@storybook/nextjs";
import Button from "@ui/button/button";

const meta = {
  title: "UI/Button",
  component: Button,
  argTypes: {
    variant: {
      control: "select",
      options: ["outline-paper", "fill-sky-deep", "buzzer"],
    },
  },
} satisfies Meta<typeof Button>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    children: "Get in touch",
    variant: "outline-paper",
  },
};
