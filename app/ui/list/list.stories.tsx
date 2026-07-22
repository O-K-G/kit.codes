import type { Meta, StoryObj } from "@storybook/nextjs";
import List from "@ui/list/list";

const meta = {
  title: "UI/List",
  component: List,
} satisfies Meta<typeof List>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    data: ["Item one", "Item two", "Item three"],
  },
};

export const Empty: Story = {
  args: {
    data: [],
  },
  parameters: {
    docs: {
      description: {
        // The component intentionally returns nothing (implicit `undefined`)
        // when `data` is empty/undefined — this story documents that
        // existing behavior, it isn't a bug in the story.
        story: "List renders nothing when `data` is empty or undefined.",
      },
    },
  },
};
