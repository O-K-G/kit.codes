import styles from "./messageForm.module.css";
import Typography from "@ui/typography/typography";
import { useActionState, useState } from "react";
import { openCloseDialog } from "@ui/dialog/dialog";
import InputOrTextarea from "@ui/input/inputOrTextarea";
import BottomBar from "./bottomBar";
import { parseLabel } from "@utils/parseLabel";
import CharactersLeftCounter from "./charactersLeftCounter";
import IconButton from "@ui/iconButton/iconButton";
import CloseIcon from "@ui/iconComponents/closeIcon";
import { sendEmail } from "@utils/sendEmail";
import { FIELDS } from "@/app/utils/handleValidation";

const TITLE = "Send me an email";
const LABELS = { email: "From:", subject: "Subject:", message: "Message:" };
const SENDING_LABEL = 'Sending...'
const PLACEHOLDERS = {
  email: "myemail@example.com",
  subject: "What brings you here?",
  message: "Your message",
};
const CLOSE_BUTTON = { ariaLabel: "Close", onClick: openCloseDialog };

export type DirTypes = "ltr" | "rtl";

export default function MessageForm() {
  const [dir, setDir] = useState<DirTypes>("ltr");
  const [counter, setCounter] = useState({});
  const [state, formAction, isPending] = useActionState(sendEmail, null);
  const sendingMessage = isPending && SENDING_LABEL;
  const statusMessage = sendingMessage || state?.message;
 
  const handleDir = () =>
    setDir((prevValue) => (prevValue === "ltr" ? "rtl" : "ltr"));

  const handleChange = ({ label, str }: { label: string; str: string }) =>
    setCounter((prevValue) => ({ ...prevValue, [parseLabel(label)]: str }));

  const inputsObj = [
    {
      type: "email",
      label: LABELS.email,
      placeholder: PLACEHOLDERS.email,
      ...FIELDS.email,
    },
    {
      type: "text",
      label: LABELS.subject,
      placeholder: PLACEHOLDERS.subject,
      ...FIELDS.subject,
    },
    {
      label: LABELS.message,
      placeholder: PLACEHOLDERS.message,
      ...FIELDS.message,
      rows: 10,
      wrapperComponent: "div",
      component: "textarea",
      onChange: (str: string) =>
        handleChange({ label: parseLabel(LABELS.message), str }),
    },
  ] as const;

  return (
    <form action={formAction} className={styles.messageForm}>
      <div className={styles.titleBar}>
        <Typography component="h2" color="paper" variant="card-heading">
          {TITLE}
        </Typography>

        <span>
          <IconButton
            aria-label={CLOSE_BUTTON.ariaLabel}
            onClick={CLOSE_BUTTON.onClick}
            groupFill
          >
            <CloseIcon />
          </IconButton>
        </span>
      </div>

      {inputsObj.map(({ label, maxLength, ...rest }, index) => {
        if (index < 2) {
          return (
            <div
              dir={dir}
              key={`i-t-${label}`}
              className={styles.inputsContainer}
            >
              <InputOrTextarea
                required
                dir={dir}
                label={label}
                maxLength={maxLength}
                onChange={(str) => handleChange({ label, str })}
                {...rest}
              />
              <CharactersLeftCounter
                counter={counter}
                maxLength={maxLength}
                label={label}
                dir={dir}
              />
            </div>
          );
        }
      })}

      <InputOrTextarea required dir={dir} {...inputsObj[2]}>
        <CharactersLeftCounter
          counter={counter}
          maxLength={inputsObj[2].maxLength}
          label={parseLabel(inputsObj[2].label)}
          dir={dir}
        />
        <BottomBar
          statusMessage={statusMessage}
          dir={dir}
          onClick={handleDir}
        />
      </InputOrTextarea>
    </form>
  );
}
