'use client'

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
  ...rest
}: InputProps) {
  const selectedId = id || `input-${label}`;
  const isTextArea = Component === "textarea";
  const parcedLabel = parseLabel(label);
  const name = `${parcedLabel}Input`;
  const dirname = `${parcedLabel}Direction`;

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
    className: typographyStyles.typography,
  };

  const handleChange: ChangeEventHandler<El> = (e) => {
    const cleanString = DOMPurify.sanitize(e.target.value);
    if (cleanString !== e.target.value) {
      e.target.value = cleanString;
    }

    onChange?.(cleanString);
  };

  const handleInvalid: ReactEventHandler<El> = (e) => {
    e.preventDefault();
    (e.target as El).dataset.error = "true";
  };

  const handleError = (target: El) => {
    const { dataset } = target;

    if (dataset.error === "true") {
      dataset.error = "false";
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
        {children}
      </InputContainerComponent>
    </WrapperComponent>
  );
}
