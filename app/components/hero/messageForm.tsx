import styles from "./messageForm.module.css";
import Typography from "@ui/typography/typography";
import Button from "@ui/button/button";
import { SubmitEventHandler, useState } from "react";
import { openCloseDialog } from "@ui/dialog/dialog";
import InputOrTextarea from "@/app/ui/input/inputOrTextarea";
import BottomBar from "./bottomBar";

const TITLE = 'Send me an email'

export type DirTypes = "ltr" | "rtl";

export default function MessageForm() {
  const [dir, setDir] = useState<DirTypes>("ltr");

  const handleDir = () =>
    setDir((prevValue) => (prevValue === "ltr" ? "rtl" : "ltr"));

  const handleSubmit: SubmitEventHandler = (e) => {
    e.preventDefault();
    console.log(e);
  };

  const inputsObj = [
    { type: "email", dir, label: "From:", minLength: 3, maxLength: 100 },
    { type: "text", dir, label: "Subject:", minLength: 3, maxLength: 100 },
    {
      dir,
      label: "Message:",
      minLength: 3,
      maxLength: 1000,
      rows: 10,
      wrapperComponent: "div",
      component: "textarea",
      children: <BottomBar dir={dir} onClick={handleDir} />,
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

      {inputsObj.map(({ label, ...rest }) => (
        <InputOrTextarea key={`i-t-${label}`} label={label} {...rest} />
      ))}
    </form>
  );
}
