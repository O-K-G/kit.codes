import type { Meta, StoryObj } from "@storybook/nextjs";
import ProgressBar from "@ui/progressBar/progressBar";

const meta = {
  title: "UI/ProgressBar",
  component: ProgressBar,
  argTypes: {
    component: { control: "select", options: ["div", "span", "li"] },
  },
} satisfies Meta<typeof ProgressBar>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    id: "typescript-skill",
    startLabel: "TypeScript",
    endLabel: "Advanced",
    value: "80",
  },
};
