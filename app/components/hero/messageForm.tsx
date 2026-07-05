import styles from "./messageForm.module.css";
import Typography from "@ui/typography/typography";
import {  useActionState, useState } from "react";
import { openCloseDialog } from "@ui/dialog/dialog";
import InputOrTextarea from "@ui/input/inputOrTextarea";
import BottomBar from "./bottomBar";
import { parseLabel } from "@utils/parseLabel";
import CharactersLeftCounter from "./charactersLeftCounter";
import IconButton from "@ui/iconButton/iconButton";
import CloseIcon from "@ui/iconComponents/closeIcon";
import { sendEmail } from "@utils/sendEmail";

const TITLE = "Send me an email";
const LABELS = { email: "From:", subject: "Subject:", message: "Message:" };
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
  const [statusMessage, setStatusMessage] = useState("");
  const [state, formAction, isPending] = useActionState(sendEmail, null);
console.log('state', state, 'ispending', isPending)
  const handleDir = () =>
    setDir((prevValue) => (prevValue === "ltr" ? "rtl" : "ltr"));

  const handleChange = ({ label, str }: { label: string; str: string }) =>
    setCounter((prevValue) => ({ ...prevValue, [parseLabel(label)]: str }));

  const inputsObj = [
    {
      type: "email",
      label: LABELS.email,
      placeholder: PLACEHOLDERS.email,
      minLength: 3,
      maxLength: 100,
    },
    {
      type: "text",
      label: LABELS.subject,
      placeholder: PLACEHOLDERS.subject,
      minLength: 3,
      maxLength: 100,
    },
    {
      label: LABELS.message,
      placeholder: PLACEHOLDERS.message,
      minLength: 3,
      maxLength: 1000,
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
