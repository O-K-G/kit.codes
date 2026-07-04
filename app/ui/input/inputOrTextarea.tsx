import { concatStyles } from "@/app/utils/concatStyles";
import styles from "./inputOrTextarea.module.css";
import DOMPurify from "isomorphic-dompurify";
import {
  ChangeEventHandler,
  Fragment,
  HTMLInputTypeAttribute,
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
  label: string;
  children?: ReactNode;
  onChange?: (val: string) => void;

  /** Defaults to 'span'. */
  wrapperComponent?: "span" | "div";

  /** Defaults to 'input'. */
  component?: "input" | "textarea";
};

export default function InputOrTextarea({
  wrapperComponent: WrapperComponent = "span",
  component: Component = "input",
  id,
  minLength,
  maxLength,
  type,
  rows,
  className = "",
  label,
  children,
  onChange,
  ...rest
}: InputProps) {
  const selectedId = id || `input-${label}`;
  const isTextArea = Component === "textarea";
  const InputContainerComponent = children ? "div" : Fragment;
  const parcedLabel = label?.replaceAll(/[^a-zA-Z]/g, "")?.toLocaleLowerCase();
  const name = `${parcedLabel}-input`;
  const dirname = `${parcedLabel}-direction`;
  const componentProps = {
    id: selectedId,
    name,
    dirname,
    minLength,
    maxLength,
    type,
    rows,
  };

  const handleChange: ChangeEventHandler<
    HTMLInputElement | HTMLTextAreaElement
  > = (e) => {
    const cleanString = DOMPurify.sanitize(e.target.value);
    e.target.value = cleanString;
    onChange?.(cleanString);
  };

  return (
    <WrapperComponent
      data-text-area={isTextArea}
      className={concatStyles([styles.inputOrTextarea, className])}
      {...rest}
    >
      <label htmlFor={selectedId}>{label}</label>

      <InputContainerComponent>
        <Component onChange={handleChange} {...componentProps} />
        {children}
      </InputContainerComponent>
    </WrapperComponent>
  );
}
