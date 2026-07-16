import { concatStyles } from "@utils/concatStyles";
import styles from "./inputOrTextarea.module.css";
import Typography, { TypographyProps } from "@ui/typography/typography";
import typographyStyles from "@ui/typography/typography.module.css";
import { parseLabel } from "@utils/parseLabel";
import DOMPurify from 'dompurify';
import {
  ChangeEventHandler,
  FocusEventHandler,
  Fragment,
  HTMLInputTypeAttribute,
  MouseEventHandler,
  ReactEventHandler,
  ReactNode,
  useRef,
} from "react";

type InputProps = {
  dir: "ltr" | "rtl";
  className?: string;
  id?: string;
  minLength?: number;
  maxLength?: number;
  type?: HTMLInputTypeAttribute;
  rows?: number;
  cols?: number;
  label: string;
  children?: ReactNode;
  required?: boolean;
  placeholder?: string;
  onChange?: (val: string) => void;

  /** Removes the field from the tab order (e.g. for the honeypot field, which is also hidden from AT via aria-hidden on the wrapper). */
  tabIndex?: number;

  /** Id of an element (e.g. a character counter) that describes this field, merged with the internal validation-error id. */
  ariaDescribedBy?: string;

  /** Defaults to 'paper'. */
  labelColor?: TypographyProps["color"];

  /** Defaults to 'section-body'. */
  inputColot?: TypographyProps["color"];

  /** Defaults to 'section-body'. */
  variant?: TypographyProps["variant"];

  /** Defaults to 'span'. */
  wrapperComponent?: "span" | "div";

  /** Defaults to 'input'. */
  component?: "input" | "textarea";
};

type El = HTMLInputElement | HTMLTextAreaElement;

export default function InputOrTextarea({
  wrapperComponent: WrapperComponent = "span",
  component: Component = "input",
  id,
  minLength,
  maxLength,
  type,
  rows,
  cols,
  className = "",
  label,
  children,
  required,
  placeholder,
  labelColor = "paper",
  inputColot = "sky-deep",
  variant = "section-body",
  onChange,
  tabIndex,
  ariaDescribedBy,
  ...rest
}: InputProps) {
  const selectedId = id || `input-${label}`;
  const isTextArea = Component === "textarea";
  const parcedLabel = parseLabel(label);
  const name = `${parcedLabel}Input`;
  const dirname = `${parcedLabel}Direction`;
  const errorId = `${selectedId}-error`;
  const errorRef = useRef<HTMLSpanElement>(null);

  const InputContainerComponent = children ? "div" : Fragment;
  const inputContainerProps = children
    ? { className: styles.inputContainer }
    : {};
  const componentProps = {
    id: selectedId,
    name,
    dirname,
    required,
    minLength,
    maxLength,
    type,
    rows,
    cols,
    placeholder,
    tabIndex,
    "aria-describedby": [ariaDescribedBy, errorId].filter(Boolean).join(" "),
    className: typographyStyles.typography,
  };

  const handleChange: ChangeEventHandler<El> = (e) => {
    const cleanString = DOMPurify.sanitize(e.target.value);
    if (cleanString !== e.target.value) {
      e.target.value = cleanString;
    }

    onChange?.(cleanString);
  };

  // Claude PR: handleInvalid suppressed the native validation bubble (the browser's own
  // mechanism for announcing invalid fields to AT) but only ever set a CSS-only
  // dataset.error flag, leaving screen reader users with no indication of *why* a
  // required field failed. Now also flips aria-invalid and fills a hidden role="alert"
  // span (rendered below, linked via aria-describedby) with the browser's own
  // validationMessage, so the failure is actually announced.
  const handleInvalid: ReactEventHandler<El> = (e) => {
    e.preventDefault();
    const target = e.target as El;
    target.dataset.error = "true";
    target.setAttribute("aria-invalid", "true");
    if (errorRef.current) {
      errorRef.current.textContent = target.validationMessage;
    }
  };

  const handleError = (target: El) => {
    const { dataset } = target;

    if (dataset.error === "true") {
      dataset.error = "false";
      target.setAttribute("aria-invalid", "false");
      if (errorRef.current) {
        errorRef.current.textContent = "";
      }
    }
  };

  const handleClick: MouseEventHandler = ({ target }) =>
    handleError(target as El);

  const handleFocus: FocusEventHandler<El> = ({ target }) =>
    handleError(target as El);

  return (
    <WrapperComponent
      data-text-area={isTextArea}
      className={concatStyles([styles.inputOrTextarea, className])}
      {...rest}
    >
      <Typography
        htmlFor={selectedId}
        component="label"
        color={labelColor}
        variant={variant}
      >
        {label}
      </Typography>

      <InputContainerComponent {...inputContainerProps}>
        <Component
          data-error="false"
          data-color={inputColot}
          data-variant={variant}
          onInvalid={handleInvalid}
          onChange={handleChange}
          onClick={handleClick}
          onFocus={handleFocus}
          {...componentProps}
        />
        <span id={errorId} role="alert" ref={errorRef} className={styles.srOnly} />
        {children}
      </InputContainerComponent>
    </WrapperComponent>
  );
}
