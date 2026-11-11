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

export default function ContactForm() {
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

  const isLtr = dir === "ltr" ? styles.ltrPadding : styles.rtlPadding;
  const isRtl = dir === "rtl" ? styles.rtlPadding : styles.ltrPadding;

  const ltrPaddingClassName = direction === "ltr" ? isLtr : "";
  const rtlPaddingClassName = direction === "rtl" ? isRtl : "";

  return (
    <form
      dir={dir}
      className={`${styles.form} ${ltrPaddingClassName} ${rtlPaddingClassName}`}
      action={(formData) => {
        void handleValidation(formData);
      }}
    >
      <div className={styles.fields}>
        {[
          {
            id: EMAIL_ID,
            label: t("emailLabel"),
            placeholder: t("emailPlaceholder"),
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
            ),
            onChange: () => handleOnChange(CONTENT_ID),
            onClick: handleOnClick,
            isError: fieldError(CONTENT_ID),
          },
        ].map(
          ({
            id,
            label,
            placeholder,
            minLength,
            maxLength,
            rows,
            component,
            bottomSlot,
            onChange,
            onClick,
            isError,
          }) => (
            <InputComponent
              key={`input-component-${id}`}
              id={id}
              label={label}
              isReset={isMessageSent}
              placeholder={placeholder}
              minLength={minLength}
              maxLength={maxLength}
              rows={rows}
              component={component}
              bottomSlot={bottomSlot}
              onChange={onChange}
              onClick={onClick}
              isError={isError}
            />
          )
        )}
      </div>
    </form>
  );
}
