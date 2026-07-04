import { concatStyles } from "@/app/utils/concatStyles";
import styles from "./inputOrTextarea.module.css";
import { Fragment, HTMLInputTypeAttribute, ReactNode } from "react";

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

  return (
    <WrapperComponent
      data-text-area={isTextArea}
      className={concatStyles([styles.inputOrTextarea, className])}
      {...rest}
    >
      <label htmlFor={selectedId}>{label}</label>

      <InputContainerComponent>
        <Component {...componentProps} />
        {children}
      </InputContainerComponent>
    </WrapperComponent>
  );
}
