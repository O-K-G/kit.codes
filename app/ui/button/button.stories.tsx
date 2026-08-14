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
    component: {
      control: "radio",
      options: ["button", "a"],
      description: "The underlying HTML element to render.",
    },
    href: {
      control: "text",
      description: "Destination URL. Forces external target behavior if absolute path provided.",
    },
  },
} satisfies Meta<typeof Button>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    children: "Get in touch",
    variant: "outline-paper",
    component: "button",
  },
};

export const InternalLink: Story = {
  args: {
    children: "Go to Dashboard",
    variant: "fill-sky-deep",
    component: "a",
    href: "/dashboard",
  },
};

export const ExternalLink: Story = {
  args: {
    children: "Visit GitHub",
    variant: "buzzer",
    component: "a",
    href: "https://github.com",
  },
};
