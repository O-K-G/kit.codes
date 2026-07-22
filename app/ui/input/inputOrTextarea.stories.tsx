import type { Meta, StoryObj } from "@storybook/nextjs";
import InputOrTextarea from "@ui/input/inputOrTextarea";
import {
  TYPOGRAPHY_COLORS,
  TYPOGRAPHY_VARIANTS,
} from "@ui/typography/typography.constants";

const meta = {
  title: "UI/InputOrTextarea",
  component: InputOrTextarea,
  argTypes: {
    labelColor: { control: "select", options: TYPOGRAPHY_COLORS },
    // Prop name is "inputColot" (typo) on the real component — reproduced
    // exactly here rather than "corrected", since story args must match
    // the actual prop shape.
    inputColot: { control: "select", options: TYPOGRAPHY_COLORS },
    variant: { control: "select", options: TYPOGRAPHY_VARIANTS },
    component: { control: "select", options: ["input", "textarea"] },
  },
} satisfies Meta<typeof InputOrTextarea>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    dir: "ltr",
    label: "Full name",
    placeholder: "Jane Doe",
    required: true,
  },
};

export const Textarea: Story = {
  args: {
    dir: "ltr",
    label: "Message",
    component: "textarea",
    rows: 4,
    placeholder: "Say hello...",
  },
};
