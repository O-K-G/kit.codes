import styles from "./messageForm.module.css";
import Typography from "@ui/typography/typography";
import Button from "@ui/button/button";
import { SubmitEventHandler, useState } from "react";
import { openCloseDialog } from "@ui/dialog/dialog";

export default function MessageForm() {
  const [dir, setDir] = useState("ltr");

  const handleDir = () =>
    setDir((prevValue) => (prevValue === "ltr" ? "rtl" : "ltr"));

  const handleSubmit: SubmitEventHandler = (e) => {
    e.preventDefault();
    console.log(e)
  };

  return (
    <form onSubmit={handleSubmit} className={styles.messageForm}>
      <div className={styles.titleBar}>
        <Typography component="h2" color="paper" variant="card-heading">
          Send me an email
        </Typography>

        <span>
          <Button onClick={openCloseDialog} variant="outline-paper">
            x
          </Button>
        </span>
      </div>

      <span dir={dir} className={styles.inputComponent}>
        <label htmlFor="from">From:</label>
        <input minLength={3} maxLength={100} id="from" type="email" />
      </span>

      <span dir={dir} className={styles.inputComponent}>
        <label htmlFor="subject">Subject:</label>
        <input minLength={3} maxLength={100} id="subject" type="text" />
      </span>

      <div dir={dir} data-text-area className={styles.inputComponent}>
        <label htmlFor="message">Message:</label>

        <div>
          <textarea maxLength={1000} id="message" rows={10} />
          <div className={styles.bottomBar}>
            <div dir={dir} className={styles.directionButtons}>
              <Button disabled={dir === "ltr"} onClick={handleDir}>
                L
              </Button>
              <Button disabled={dir === "rtl"} onClick={handleDir}>
                R
              </Button>
            </div>
            
              <Button type="submit">Send</Button>
          </div>
        </div>
      </div>
    </form>
  );
}
