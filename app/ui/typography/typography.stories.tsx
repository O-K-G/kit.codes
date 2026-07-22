import type { Meta, StoryObj } from "@storybook/nextjs";
import Typography from "@ui/typography/typography";
import {
  TYPOGRAPHY_COLORS,
  TYPOGRAPHY_VARIANTS,
} from "@ui/typography/typography.constants";

const meta = {
  title: "UI/Typography",
  component: Typography,
  argTypes: {
    variant: { control: "select", options: TYPOGRAPHY_VARIANTS },
    color: { control: "select", options: TYPOGRAPHY_COLORS },
    component: {
      control: "select",
      options: [
        "p",
        "div",
        "span",
        "li",
        "label",
        "footer",
        "h1",
        "h2",
        "h3",
        "h4",
        "h5",
        "h6",
      ],
    },
  },
} satisfies Meta<typeof Typography>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Playground: Story = {
  args: {
    children: "The quick brown fox jumps over the lazy dog",
    variant: "body",
    color: "paper",
  },
};

export const AllVariants: Story = {
  // render() below fully owns the output — this only satisfies StoryObj's
  // required `children` typing (Typography.children has no default).
  args: {
    children: null,
  },
  render: () => (
    <>
      {TYPOGRAPHY_VARIANTS.map((variant) => (
        <div key={variant} style={{ marginBottom: "0.5rem" }}>
          <Typography variant={variant} color="paper">
            {variant}
          </Typography>
        </div>
      ))}
    </>
  ),
};
