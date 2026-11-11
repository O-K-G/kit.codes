/* eslint-disable no-unused-vars */
import { DIRECTION_BY_LANGUAGE } from "@constants/LocaleDirection";
import { z } from "zod";
import {
  Dispatch,
  MouseEventHandler,
  PropsWithChildren,
  ReactNode,
  Ref,
  RefObject,
  SetStateAction,
  MouseEvent,
} from "react";

export const CONTACT_FORM_EMAIL_MAX_LENGTH = 100;
export const CONTACT_FORM_SUBJECT_MIN_LENGTH = 1;
export const CONTACT_FORM_SUBJECT_MAX_LENGTH = 100;
export const CONTACT_FORM_CONTENT_MIN_LENGTH = 1;
export const CONTACT_FORM_CONTENT_MAX_LENGTH = 1000;

export interface ModalContextComponentProps {
  children: ReactNode;
}

export interface ModalContextProps {
  onModalContentChange: Dispatch<SetStateAction<ReactNode>>;
  modalRef: Ref<HTMLDialogElement | null>;
  modalContent: ReactNode;
  onCloseModal: (e: Event | MouseEvent<HTMLElement>) => void;
}

export interface DialogTitleProps {
  label: string;
  onClick: MouseEventHandler<HTMLButtonElement>;
  className?: string;
  closeButtonIcon?: ReactNode;
}

export interface CurrentSection {
  currentSection?: "about" | "projects" | "skills" | "experience" | "contact";
  minHeightClassName?: string;
}
export interface SectionProps extends CurrentSection {
  children: ReactNode;
  className?: string;
}

interface TitleLabels {
  topLabel?: string;
  bottomLabel?: string;
}

export interface TitleProps extends TitleLabels {
  id?: number;
  component?: "h1" | "h2" | "h3" | "h4" | "h5" | "h6";
  label?: string;
  /** Must be in the following format: ' ... before:content-['some_string'] ',
   * as JIT mode can't handle template literals.
   */
  labelGlowText?: string;
  className?: string;
  border?: boolean;
  beforeBlurClassName?: string;
  fontClassName?: string;
  textSizeClassName?: string;
  textColorClassName?: string;
  beforeTextStrokeClassName?: string;
  textStrokeClassName?: string;
}

export interface AboutTargetIconProps {
  open: boolean;
  bottom?: boolean;
}

export interface BottomInputComponentButtonsProps {
  dir: "ltr" | "rtl";
  onClick: (val: "ltr" | "rtl") => void;
  isSubmitDisabled: boolean;
  leftSlot: ReactNode;
  onSubmit: () => void;
}

export interface InputComponentProps {
  component?: "input" | "textarea";
  id: string;
  placeholder: string;
  minLength?: number;
  maxLength: number;
  rows?: number;
  onChange: () => void;
  onClick?: () => void;
  isError?: boolean;
  bottomSlot?: ReactNode;
  isReset?: boolean;
  label: string;
}

export interface IconsProps {
  className: string;
}

export const FormDataSchema = z.object({
  email: z.string().email().max(CONTACT_FORM_EMAIL_MAX_LENGTH),
  subject: z
    .string()
    .max(CONTACT_FORM_SUBJECT_MAX_LENGTH)
    .min(CONTACT_FORM_SUBJECT_MIN_LENGTH),
  content: z
    .string()
    .max(CONTACT_FORM_CONTENT_MAX_LENGTH)
    .min(CONTACT_FORM_CONTENT_MIN_LENGTH),
});

export type FormValidationProps = z.infer<typeof FormDataSchema>;

export type Fields = "email" | "subject" | "content";

export type FormErrorNames = Fields[];

export interface MailHTMLTemplateProps {
  dir: string;
  email: string;
  subject: string;
  content: string;
}

export const BASE_STATUS_CODES = {
  400: false,
  201: true,
  401: false,
} as const;

export interface AnchorLinkProps {
  url: string;
  icon: ReactNode;
  isRounded?: boolean;
  "aria-label": string;
  "data-testid": string;
}

export interface CogwheelProps {
  sizeClassName?: string;
  children?: ReactNode;
  childrenClassName?: string;
  bgClassName?: string;
  className?: string;
  "data-testid"?: string;
}

export interface BoltProps {
  centerPointClassName?: string;
}

export interface ArrowRightIconProps {
  className?: string;
  strokeClassName: string;
  fillClassName: string;
}

export interface IconButtonProps {
  onClick: MouseEventHandler<HTMLButtonElement>;
  "aria-label": string;
  "data-testid"?: string;
  "data-pointer-events"?: boolean;
  icon: ReactNode;
  className?: string;
  disabled?: boolean;
}

export interface SideLinksProps {
  className?: string;
  ulClassName?: string;
  hideChangeLanguageButton?: boolean;
}

export interface HandleChildrenWithNewPropsProps {
  children: ReactNode;
  scrollableRef: Ref<null>;
  onSubsectionSelectChange: Dispatch<SetStateAction<number>>;
}

export interface ChildWithNewProps {
  id: number;
  ref: Ref<null>;
  onSubsectionSelectChange: Dispatch<SetStateAction<number>>;
}

export interface PropsWithId extends PropsWithChildren {
  id: number;
}

export interface UseObserveScrollSubsectionProps {
  scrollableRef?: RefObject<HTMLDivElement>;
  id?: number;
  onSubsectionSelectChange?: Dispatch<SetStateAction<number>>;
  scrollableItemRef: Ref<null>;
}

export interface ScrollableSubsectionItemProps {
  children: ReactNode;
  onSubsectionSelectChange?: Dispatch<SetStateAction<number>>;
  id?: number;
  ref?: RefObject<HTMLDivElement>;
}
export interface ContactGoBackButtonProps {
  children: ReactNode;
  onClick: () => void;
  className?: string;
}

export interface ContactProps {
  onClick: () => void;
  open: boolean;
}

export interface ExpandableButtonProps {
  alternativeLabel: string;
}

export interface MainTitleProps {
  children: ReactNode;
  component?: "h1" | "h2" | "h3" | "h4" | "h5" | "h6";
  className?: string;
  /** Starts the typing animation after a 5 seconds delay. */
  isDelayedAnimation?: boolean;
  border?: boolean;
  variant?: "mainTitle" | "subtitle";
  topLabel?: string;
  bottomLabel?: string;
  isRightLabelBlink?: boolean;
}

export interface BorderProps {
  className?: string;
  leftLabel?: string;
  rightLabel?: string;
  isTextBlink?: boolean;
}

export interface LoaderProps {
  open?: boolean;
  label?: string;
  loaderTextAdditionalSlot?: ReactNode;
}

export interface LoaderTextProps {
  label?: string;
  slot?: ReactNode;
}

export interface FixedBottomComponentProps {
  label: string;
  slot?: ReactNode;
  className?: string;
  children?: ReactNode;
  isTransparent?: boolean;
  hideOnScroll?: boolean;
  showOnScroll?: boolean;
}

export interface SelectLanguageButtonProps {
  label: string;
  value: keyof typeof DIRECTION_BY_LANGUAGE;
}

export interface ChangeLanguageProps {
  hide?: boolean;
}

export interface CvProps {
  hide?: boolean;
}

export interface SkillsListRowProps {
  children: ReactNode;
  className: string;
}

export interface SkillBlockProps {
  str: string;
  "data-visible-mobile": boolean;
}

export interface handleDownloadProps {
  url: string | URL | Request;
  init?: RequestInit | undefined;
  fileName?: string;
  method?: "GET" | "POST" | "PUT" | "DELETE";
  headers?: Record<string, string>;
  errorModalContent: ReactNode;
}

export interface GetDirByLocaleProps {
  locale: string | string[];
}
