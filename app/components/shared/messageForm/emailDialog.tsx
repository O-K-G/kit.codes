import Dialog from "@ui/dialog/dialog";
import MessageForm from "./messageForm";
import { DIALOG_ARIA_LABEL } from "./emailDialog.constants";

type EmailDialogProps = {
  open: boolean;
  onClose: () => void;
};

export default function EmailDialog({ open, onClose }: EmailDialogProps) {
  return (
    <Dialog open={open} aria-label={DIALOG_ARIA_LABEL} onClose={onClose}>
      <MessageForm onClick={onClose} />
    </Dialog>
  );
}
