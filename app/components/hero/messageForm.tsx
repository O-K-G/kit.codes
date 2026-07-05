import styles from "./messageForm.module.css";
import Typography from "@ui/typography/typography";
import { useActionState, useEffect, useRef, useState } from "react";
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
const CLOSE_BUTTON = { ariaLabel: "Close", onClick: openCloseDialog };
const INPUT_TYPES = ["input", "textarea"];
const SENDING_LABEL = "Sending...";
const PLACEHOLDERS = {
  email: "myemail@example.com",
  subject: "What brings you here?",
  message: "Your message",
};

export type DirTypes = "ltr" | "rtl";

export default function MessageForm() {
  const [dir, setDir] = useState<DirTypes>("ltr");
  const [counter, setCounter] = useState({});
  const [state, formAction, isPending] = useActionState(sendEmail, null);
  const sendingMessage = isPending && SENDING_LABEL;
  const statusMessage = sendingMessage || state?.message;
  const backupData = useRef({});
  const formRef = useRef<HTMLFormElement>(null);

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

  const handleFormAction: (e: FormData) => void = (e) => {
    backupData.current = Object.fromEntries(e.entries());
    formAction(e);
  };

  /**
   * The form resets the inputs even if sending fails.
   * This preserves the form data on the client in case sending fails.
   * */
  useEffect(() => {
    if (!isPending) {
      if (state?.success === false) {
        INPUT_TYPES.forEach((str) =>
          Array.from(formRef.current?.getElementsByTagName(str) || []).forEach(
            (field) => {
              const backupDataKeys = Object.keys(backupData.current);
              const el = field as (HTMLInputElement | HTMLTextAreaElement) & {
                dirname: string;
              };
              const nameKey = el.name as keyof typeof backupData.current;
              const dirnameKey = el.dirname as keyof typeof backupData.current;

              if (backupDataKeys.includes(nameKey)) {
                el.value = backupData.current[nameKey];
              }

              if (backupDataKeys.includes(dirnameKey)) {
                el.dirname = backupData.current[dirnameKey];
              }
            },
          ),
        );
      }

      if (state?.success) {
        backupData.current = {};
      }
    }
  }, [isPending, state?.success]);

  return (
    <form
      ref={formRef}
      action={handleFormAction}
      className={styles.messageForm}
    >
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
