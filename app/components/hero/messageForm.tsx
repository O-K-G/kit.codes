import styles from "./messageForm.module.css";
import Typography from "@ui/typography/typography";
import Button from "@ui/button/button";
import { SubmitEventHandler, useState } from "react";
import { openCloseDialog } from "@ui/dialog/dialog";
import InputOrTextarea from "@ui/input/inputOrTextarea";
import BottomBar from "./bottomBar";
import { parseLabel } from "@utils/parseLabel";
import CharactersLeftCounter from "./charactersLeftCounter";

const TITLE = "Send me an email";
const LABELS = { email: "From:", subject: "Subject:", message: "Message:" };
const PLACEHOLDERS = { email: "myemail@example.com", subject: "What brings you here?", message: "Your message" };

export type DirTypes = "ltr" | "rtl";

export default function MessageForm() {
  const [dir, setDir] = useState<DirTypes>("ltr");
  const [counter, setCounter] = useState({});

  const handleDir = () =>
    setDir((prevValue) => (prevValue === "ltr" ? "rtl" : "ltr"));

  const handleSubmit: SubmitEventHandler<HTMLFormElement> = (e) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const data = Object.fromEntries(formData.entries());

    console.log(data);
  };

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
    <form onSubmit={handleSubmit} className={styles.messageForm}>
      <div className={styles.titleBar}>
        <Typography component="h2" color="paper" variant="card-heading">
          {TITLE}
        </Typography>

        <span>
          <Button onClick={openCloseDialog} variant="outline-paper">
            x
          </Button>
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
        <BottomBar dir={dir} onClick={handleDir} />
      </InputOrTextarea>
    </form>
  );
}
