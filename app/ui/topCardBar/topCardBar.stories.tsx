import type { Meta, StoryObj } from "@storybook/nextjs";
import TopCardBar from "@ui/topCardBar/topCardBar";
import Badge from "@ui/badge/badge";
import { TYPOGRAPHY_COLORS } from "@ui/typography/typography.constants";

const meta = {
  title: "UI/TopCardBar",
  component: TopCardBar,
  argTypes: {
    leftSlotColor: { control: "select", options: TYPOGRAPHY_COLORS },
  },
} satisfies Meta<typeof TopCardBar>;

export default meta;

type Story = StoryObj<typeof meta>;

export const StringRightSlot: Story = {
  args: {
    leftSlot: "UNIT 02",
    leftSlotColor: "window",
    rightSlot: "2023 — Present",
  },
};

export const NodeRightSlot: Story = {
  args: {
    leftSlot: "UNIT 02",
    leftSlotColor: "window",
    rightSlot: <Badge label="Open" />,
  },
};
