import type { Meta, StoryObj } from "@storybook/nextjs";
import { useState } from "react";
import Dialog from "@ui/dialog/dialog";
import Button from "@ui/button/button";
import Typography from "@ui/typography/typography";

const meta = {
  title: "UI/Dialog",
  component: Dialog,
  // The story's own render function below fully manages open/close state
  // and ignores these args — they exist only to satisfy Meta<typeof
  // Dialog>'s required-props typing.
  args: {
    "aria-label": "Example dialog",
    children: null,
    open: false,
    onClose: () => {},
  },
} satisfies Meta<typeof Dialog>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => {
    const [open, setOpen] = useState(false);

    return (
      <>
        {/* Local placeholder so Dialog's document.querySelector("nav")
            inert-toggling has a real target to demo, scoped to this story. */}
        <nav>
          <Typography component="span">Nav placeholder</Typography>
        </nav>

        <Button onClick={() => setOpen(true)}>Open dialog</Button>

        <Dialog aria-label="Example dialog" open={open} onClose={() => setOpen(false)}>
          <Typography component="h2" variant="section-heading">
            Example dialog
          </Typography>
          <Typography component="p">
            Tab/Shift+Tab cycles focus within this dialog, and Escape closes it.
          </Typography>
          <Button onClick={() => setOpen(false)}>Close</Button>
        </Dialog>
      </>
    );
  },
};
