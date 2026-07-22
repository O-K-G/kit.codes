import type { Meta, StoryObj } from "@storybook/nextjs";
import RadioTowerIcon from "@ui/iconComponents/radioTowerIcon/radioTowerIcon";

const meta = {
  title: "UI/Icons/RadioTowerIcon",
  component: RadioTowerIcon,
} satisfies Meta<typeof RadioTowerIcon>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  // Unlike the flat icon components, each path here has its fill set via
  // radioTowerIcon.module.css (with !important), driven by the --mist,
  // --signage, and --paper CSS custom properties from globals.css — no
  // explicit fill prop needed for this one to render/animate correctly.
  args: {
    width: 48,
    height: 48,
  },
};
