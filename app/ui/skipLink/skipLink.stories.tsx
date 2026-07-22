import type { Meta, StoryObj } from "@storybook/nextjs";
import SkipLink from "@ui/skipLink/skipLink";
import { MAIN_CONTENT_ID } from "@ui/skipLink/skipLink.constants";

const meta = {
  title: "UI/SkipLink",
  component: SkipLink,
} satisfies Meta<typeof SkipLink>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: (args) => (
    <>
      <SkipLink {...args} />
      <div id={MAIN_CONTENT_ID}>Main content target</div>
    </>
  ),
};
