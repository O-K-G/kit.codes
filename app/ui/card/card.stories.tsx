import type { Meta, StoryObj } from "@storybook/nextjs";
import Card from "@ui/card/card";
import { TYPOGRAPHY_COLORS } from "@ui/typography/typography.constants";

const meta = {
  title: "UI/Card",
  component: Card,
  argTypes: {
    leftSlotColor: { control: "select", options: TYPOGRAPHY_COLORS },
    leftBorder: { control: "select", options: ["window", "signage"] },
    component: { control: "select", options: ["div", "li"] },
  },
} satisfies Meta<typeof Card>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    leftSlot: "UNIT 02",
    leftSlotColor: "window",
    leftBorder: "window",
    rightSlot: "2023 — Present",
    title: "Senior Frontend Engineer",
    subtitle: "Some Company Inc.",
    children: "Led the migration to a component-driven design system.",
    hoverEffect: true,
  },
};
