import type { Meta, StoryObj } from "@storybook/nextjs";
import Badge from "@ui/badge/badge";
import { TYPOGRAPHY_COLORS } from "@ui/typography/typography.constants";

const meta = {
  title: "UI/Badge",
  component: Badge,
  argTypes: {
    color: { control: "select", options: TYPOGRAPHY_COLORS },
    borderColor: { control: "select", options: ["signage", "block-border"] },
    badgeBorder: { control: "select", options: ["roundish", "pill"] },
    rotate: { control: "select", options: [undefined, "left", "right"] },
  },
} satisfies Meta<typeof Badge>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    label: "Open for work",
  },
};

export const BreakingLetterBlink: Story = {
  args: {
    label: "OPEN * SIGN",
    breakingLetter: "*",
    letterBlink: true,
    borderBlink: true,
    rotate: "left",
  },
};
