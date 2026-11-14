"use client";

import InputComponent from "@components/contact/InputComponent";
import { useState, useContext } from "react";
import { handleSubmit } from "@utils/handleSubmit";
import formValidation from "@utils/formValidation";
import ProgressIndicators from "@components/contact/ProgressIndicators";
import BottomInputComponentButtons from "@components/contact/BottomInputComponentButtons";
import ErrorDialogMeesage from "@components/contact/ErrorDialogMessage";
import { ModalContext as modalContext } from "@ui/modalContext/ModalContext";
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
  BASE_STATUS_CODES,
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
  const { onModalContentChange: setModalContent } = useContext(modalContext);
  const t = useTranslations("contact");

  const handleValidation = async (formData: FormData) => {
    formData.append("dir", dir);

    const { isValidated, error } = formValidation({
      email: formData.get(EMAIL_ID) as string,
      subject: formData.get(SUBJECT_ID) as string,
      content: formData.get("content") as string,
    });

    if (error) {
      setErrors(Object.keys(error) as FormErrorNames);
    } else if (isValidated) {
      try {
        const reqData = await handleSubmit(formData);
        const { status } = reqData ?? { status: "" };
        if (status) {
          const ok =
            BASE_STATUS_CODES[
              status as unknown as keyof typeof BASE_STATUS_CODES
            ];

          if (ok && status === "201") {
            setMessageSent(true);
          }

          if (!ok) {
            if (isMessageSent) {
              setMessageSent(false);
            }
            setModalContent(<ErrorDialogMeesage details={status} />);
          }
        }
      } catch (clientError) {
        setModalContent(
          <ErrorDialogMeesage details={(clientError as string)?.toString()} />
        );
      }
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

  return (
    <form
      dir={dir}
      className={styles.form}
      action={(formData) => {
        void handleValidation(formData);
      }}
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
                  onSubmit={() => setMessageSent(false)}
                  onClick={(val) => {
                    if (dir === "ltr" && val === "rtl") {
                      setDir("rtl");
                    }
                    if (dir === "rtl" && val === "ltr") {
                      setDir("ltr");
                    }
                  }}
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
  );
}
