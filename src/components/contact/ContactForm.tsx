"use client";

import InputComponent from "@components/contact/InputComponent";
import { useEffect, useEffectEvent, useId, useRef, useState } from "react";
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
  CONTACT_FORM_HONEYPOT_NAME,
  CONTACT_FORM_STARTED_AT_NAME,
} from "@constants/interfaces";

const EMAIL_ID = "email";
const SUBJECT_ID = "subject";
const CONTENT_ID = "content";

/** The fields in the form's order: after a failed send, the focus goes to the first with an error */
const FIELD_ORDER: Fields[] = [EMAIL_ID, SUBJECT_ID, CONTENT_ID];

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
  /** Whether the send failed for too many messages lately (the dialog then says so) */
  const [isRateLimited, setRateLimited] = useState(false);
  /** When the form was shown, for the server to tell people from bots, which send it at once */
  const startedAt = useRef(0);
  /** Counts failed sends: each moves the focus to the first field with an error (see below) */
  const [failedSends, setFailedSends] = useState(0);
  /** The error dialog's message, which describes it */
  const sendErrorMessageId = useId();
  const t = useTranslations("contact");

  // Set after hydration: a time rendered on the server wouldn't match the browser's
  useEffect(() => {
    startedAt.current = Date.now();
  }, []);

  // After a failed send, once the errors are rendered (each field described by its own), the focus goes
  // to the first field with one, so screen readers read its error out (WCAG 3.3.1) and keyboard users
  // are at the field to fix. Only on a new failed send, not as errors clear while typing
  const focusFirstError = useEffectEvent(() => {
    const first = FIELD_ORDER.find((field) => (errors as Fields[]).includes(field));
    if (first) {
      document.getElementById(first)?.focus();
    }
  });
  useEffect(() => {
    if (failedSends) {
      focusFirstError();
    }
  }, [failedSends]);

  /**
   * The form's action: checks the fields here first (and shows what's wrong), then sends the message
   * on the server. Passed to <form action> as is, so the form stays pending (see useFormStatus: the
   * progress indicator, the busy send button) until the server has answered.
   */
  const handleSend = async (formData: FormData) => {
    formData.append("dir", dir);
    formData.append(CONTACT_FORM_STARTED_AT_NAME, String(startedAt.current));

    const { invalidFields } = formValidation({
      email: formData.get(EMAIL_ID) as string,
      subject: formData.get(SUBJECT_ID) as string,
      content: formData.get(CONTENT_ID) as string,
    });

    if (invalidFields.length) {
      setErrors(invalidFields);
      setFailedSends((count) => count + 1);
      return;
    }

    try {
      const result = await sendMessage(formData);

      if (result.ok) {
        setMessageSent(true);
        startedAt.current = Date.now();
      } else if (result.error === "invalid") {
        setErrors(result.fieldErrors);
        setFailedSends((count) => count + 1);
      } else {
        setMessageSent(false);
        setRateLimited(result.error === "rate-limited");
        setSendError(result.error);
      }
    } catch (networkError) {
      setMessageSent(false);
      setRateLimited(false);
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
      {/* noValidate: the form checks the fields itself (see handleSend), with its own messages in the
        * page's language, shown by each field, rather than the browser's bubbles */}
      <form
        dir={dir}
        className={styles.form}
        action={handleSend}
        noValidate
      >
        {/* A bot trap: hidden from people and assistive tech, so only bots fill it in */}
        <input
          type="text"
          name={CONTACT_FORM_HONEYPOT_NAME}
          className={styles.honeypot}
          tabIndex={-1}
          autoComplete="off"
          aria-hidden="true"
          defaultValue=""
        />
        <div>
          {[
            {
              id: EMAIL_ID,
              label: t("emailLabel"),
              placeholder: t("emailPlaceholder"),
              /* Lets browsers fill in the user's address (WCAG 1.3.5), with an email keyboard */
              autoComplete: "email",
              type: "email" as const,
              enterKeyHint: "next" as const,
              maxLength: CONTACT_FORM_EMAIL_MAX_LENGTH,
              onChange: () => handleOnChange(EMAIL_ID),
              onClick: handleOnClick,
              isError: fieldError(EMAIL_ID),
            },
            {
              id: SUBJECT_ID,
              label: t("subjectLabel"),
              placeholder: t("subjectPlaceholder"),
              enterKeyHint: "next" as const,
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
      {/* Named by its title, described by its message: both are read out as it opens */}
      <Dialog
        open={sendError !== null}
        onClose={handleCloseSendError}
        aria-describedby={sendErrorMessageId}
      >
        <ErrorDialogMeesage
          messageId={sendErrorMessageId}
          details={sendError ?? ""}
          isRateLimited={isRateLimited}
        />
      </Dialog>
    </>
  );
}
