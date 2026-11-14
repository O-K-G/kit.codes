"use client";

import InputComponent from "@components/contact/InputComponent";
import { useState } from "react";
import { sendMessage } from "@components/contact/sendMessage";
import formValidation from "@utils/formValidation";
import ProgressIndicators from "@components/contact/ProgressIndicators";
import BottomInputComponentButtons from "@components/contact/BottomInputComponentButtons";
import ErrorDialogMeesage from "@components/contact/ErrorDialogMessage";
import Dialog from "@ui/dialog/Dialog";
import { useTranslations } from "next-intl";
import { useParams } from "next/navigation";
import getDirByLocale from "@utils/getDirByLocale";
import styles from "./ContactForm.module.css";
import {
  type FormErrorNames,
  type Fields,
  type ContactFormProps,
  CONTACT_FORM_EMAIL_MAX_LENGTH,
  CONTACT_FORM_SUBJECT_MIN_LENGTH,
  CONTACT_FORM_SUBJECT_MAX_LENGTH,
  CONTACT_FORM_CONTENT_MIN_LENGTH,
  CONTACT_FORM_CONTENT_MAX_LENGTH,
} from "@constants/interfaces";

const EMAIL_ID = "email";
const SUBJECT_ID = "subject";
const CONTENT_ID = "content";

/**
 * `footer` (the side links) goes under the send button, in the fields' column, so the two share a
 * center whatever the labels' width. It keeps the page's direction when the form's is toggled.
 */
export default function ContactForm({ footer }: ContactFormProps) {
  const { locale }: { locale: string } = useParams() || {};
  const direction = getDirByLocale({ locale });
  const [dir, setDir] = useState<"ltr" | "rtl">(direction);
  const [errors, setErrors] = useState<[] | FormErrorNames>([]);
  const [isMessageSent, setMessageSent] = useState(false);
  /** The details of a failed send, shown in an error dialog */
  const [sendError, setSendError] = useState<string | null>(null);
  const t = useTranslations("contact");

  /**
   * The form's action: checks the fields here first (and shows what's wrong), then sends the message
   * on the server. Passed to <form action> as is, so the form stays pending (see useFormStatus: the
   * progress indicator, the busy send button) until the server has answered.
   */
  const handleSend = async (formData: FormData) => {
    formData.append("dir", dir);

    const { invalidFields } = formValidation({
      email: formData.get(EMAIL_ID) as string,
      subject: formData.get(SUBJECT_ID) as string,
      content: formData.get(CONTENT_ID) as string,
    });

    if (invalidFields.length) {
      setErrors(invalidFields);
      return;
    }

    try {
      const result = await sendMessage(formData);

      if (result.ok) {
        setMessageSent(true);
      } else if (result.error === "invalid") {
        setErrors(result.fieldErrors);
      } else {
        setMessageSent(false);
        setSendError(result.error);
      }
    } catch (networkError) {
      setMessageSent(false);
      setSendError(String(networkError));
    }
  };

  const fieldError = (val: Fields) =>
    (errors as Array<typeof val>).includes(val);

  const handleOnChange = (val: Fields) => {
    if (fieldError(val)) {
      setErrors(errors.filter((str) => str !== val));
    }
  };

  const handleOnClick = () => {
    if (isMessageSent) {
      setMessageSent(false);
    }
  };

  /** A new send clears the last one's "sent" message */
  const handleSendClick = () => setMessageSent(false);

  /** The align button switches the form's text direction */
  const handleAlign = (newDir: "ltr" | "rtl") => setDir(newDir);

  const handleCloseSendError = () => setSendError(null);

  return (
    <>
      <form
        dir={dir}
        className={styles.form}
        action={handleSend}
      >
        <div>
          {[
            {
              id: EMAIL_ID,
              label: t("emailLabel"),
              placeholder: t("emailPlaceholder"),
              /* Lets browsers fill in the user's address (WCAG 1.3.5), with an email keyboard */
              autoComplete: "email",
              inputMode: "email" as const,
              maxLength: CONTACT_FORM_EMAIL_MAX_LENGTH,
              onChange: () => handleOnChange(EMAIL_ID),
              onClick: handleOnClick,
              isError: fieldError(EMAIL_ID),
            },
            {
              id: SUBJECT_ID,
              label: t("subjectLabel"),
              placeholder: t("subjectPlaceholder"),
              minLength: CONTACT_FORM_SUBJECT_MIN_LENGTH,
              maxLength: CONTACT_FORM_SUBJECT_MAX_LENGTH,
              onChange: () => handleOnChange(SUBJECT_ID),
              onClick: handleOnClick,
              isError: fieldError(SUBJECT_ID),
            },
            {
              id: CONTENT_ID,
              label: t("contentLabel"),
              placeholder: t("contentPlaceholder"),
              minLength: CONTACT_FORM_CONTENT_MIN_LENGTH,
              maxLength: CONTACT_FORM_CONTENT_MAX_LENGTH,
              rows: 5,
              component: "textarea" as const,
              bottomSlot: (
                <>
                  <BottomInputComponentButtons
                    dir={dir}
                    isSubmitDisabled={!!errors.length}
                    onSubmit={handleSendClick}
                    onClick={handleAlign}
                    leftSlot={<ProgressIndicators isMessageSent={isMessageSent} />}
                  />
                  {footer && <div dir={direction}>{footer}</div>}
                </>
              ),
              onChange: () => handleOnChange(CONTENT_ID),
              onClick: handleOnClick,
              isError: fieldError(CONTENT_ID),
            },
          ].map((props) => (
            <InputComponent
              key={`input-component-${props.id}`}
              isReset={isMessageSent}
              {...props}
            />
          ))}
        </div>
      </form>
      <Dialog open={sendError !== null} onClose={handleCloseSendError}>
        <ErrorDialogMeesage details={sendError ?? ""} />
      </Dialog>
    </>
  );
}
