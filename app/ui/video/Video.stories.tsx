import type { Meta, StoryObj } from "@storybook/nextjs";
import Video from "@ui/video/Video";

const meta = {
  title: "UI/Video",
  component: Video,
} satisfies Meta<typeof Video>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    primarySrc: "/videos/city-night.mp4",
    primarySrcType: "video/mp4",
    backupSrc: "/videos/city-night.webm",
    backupSrcType: "video/webm",
    // autoPlay requires muted for browsers to actually allow it to play.
    autoPlay: true,
    muted: true,
    loop: true,
    playsInline: true,
  },
};
