import { DIRECTION_BY_LANGUAGE } from "@constants/LocaleDirection";
import { z } from "zod";
import {
  ComponentPropsWithoutRef,
  MouseEventHandler,
  ReactNode,
  RefObject,
} from "react";

/** Zod doesn't try compiling its validators with `Function` (eval): the CSP forbids it (see proxy.ts),
 * so the attempt only fails and is reported as a violation */
z.config({ jitless: true });

export const CONTACT_FORM_EMAIL_MAX_LENGTH = 100;
export const CONTACT_FORM_SUBJECT_MIN_LENGTH = 1;
export const CONTACT_FORM_SUBJECT_MAX_LENGTH = 100;
export const CONTACT_FORM_CONTENT_MIN_LENGTH = 1;
export const CONTACT_FORM_CONTENT_MAX_LENGTH = 1000;

export interface DialogProps extends Omit<ComponentPropsWithoutRef<"dialog">, "open" | "onClose"> {
  /** Shown as a modal while true */
  open: boolean;
  /** Called when the dialog asks to close (its close button, Escape, a click on its backdrop) */
  onClose: () => void;
  children: ReactNode;
}

export interface DialogTitleProps {
  label: string;
  className?: string;
  closeButtonIcon?: ReactNode;
}

export type SectionName = "about" | "projects" | "skills" | "experience" | "contact";

/** The section the current route points at (e.g. /en/skills): its background is fetched first. */
export interface ActiveSectionProps {
  activeSection?: SectionName;
}

export interface SectionBackgroundProps {
  currentSection?: SectionName;
  minHeightClassName?: string;
  /** Fetched with high priority, and the loader waits for it. */
  priority?: boolean;
}

export interface SectionProps extends ActiveSectionProps {
  currentSection?: SectionName;
  children: ReactNode;
  className?: string;
}

export interface AboutTargetIconProps {
  open: boolean;
  bottom?: boolean;
  /** Blinks red twice when it turns true */
  blink?: boolean;
  /** Whether the blink runs; it pauses where it is while false */
  running?: boolean;
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
  /** The kind of data the field takes, so browsers can fill it in (WCAG 1.3.5) */
  autoComplete?: string;
  inputMode?: "email" | "text";
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
  className?: string;
}

/**
 * The contact form's fields, validated alike in the browser and on the server. Each is trimmed
 * first, so text made only of spaces doesn't count. (The email is trimmed before the format check:
 * `z.email().trim()` would check it first.)
 */
export const FormDataSchema = z.object({
  email: z.string().trim().pipe(z.email().max(CONTACT_FORM_EMAIL_MAX_LENGTH)),
  subject: z
    .string()
    .trim()
    .max(CONTACT_FORM_SUBJECT_MAX_LENGTH)
    .min(CONTACT_FORM_SUBJECT_MIN_LENGTH),
  content: z
    .string()
    .trim()
    .max(CONTACT_FORM_CONTENT_MAX_LENGTH)
    .min(CONTACT_FORM_CONTENT_MIN_LENGTH),
});

export type FormValidationProps = z.infer<typeof FormDataSchema>;

export type Fields = "email" | "subject" | "content";

export type FormErrorNames = Fields[];

/** A message as the server receives it: the fields, and the direction the text was written in */
export const ContactMessageSchema = FormDataSchema.extend({
  dir: z.enum(["ltr", "rtl"]).catch("ltr"),
});

export type ContactMessage = z.infer<typeof ContactMessageSchema>;

/** The contact form's hidden bot traps: a field only bots fill in, and when the form was shown */
export const CONTACT_FORM_HONEYPOT_NAME = "website";
export const CONTACT_FORM_STARTED_AT_NAME = "startedAt";

/**
 * What sending a message comes to: sent, its fields invalid (which ones), too many messages sent
 * lately, or the sending failed
 */
export type SendMessageResult =
  | { ok: true }
  | { ok: false; error: "invalid"; fieldErrors: FormErrorNames }
  | { ok: false; error: "rate-limited" }
  | { ok: false; error: "send-failed" };

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
  icon: ReactNode;
  className?: string;
  disabled?: boolean;
}

export interface ContactFormProps {
  /** Shown under the send button, centered with it (the side links) */
  footer?: ReactNode;
}

export interface SideLinksProps {
  className?: string;
  ulClassName?: string;
  hideChangeLanguageButton?: boolean;
}

export interface UseObserveScrollSubsectionProps {
  scrollableRef: RefObject<HTMLDivElement | null> | null;
  id?: number;
  onSubsectionSelectChange: (id: number) => void;
  scrollableItemRef: RefObject<HTMLDivElement | null>;
}

/** A carousel slide's props; `id` (its index) and `total` are set by the carousel */
export interface ScrollableSubsectionItemProps {
  children: ReactNode;
  id?: number;
  total?: number;
}
export interface ContactGoBackButtonProps {
  children: ReactNode;
  onClick: () => void;
  className?: string;
}

export interface GaugeProps {
  /** Whether the gauge's animations run; it pauses where it is while false */
  running: boolean;
  /** Called as the count hits 100%, just before it blinks */
  onFull?: () => void;
  /** Called once the gauge has filled and its count has blinked */
  onComplete?: () => void;
  /** Sizes and places the gauge, which otherwise fills its parent */
  className?: string;
}

export interface ExpandableContentProps {
  /** The text revealed once the gauge has filled */
  text: string;
}

export interface MainTitleProps {
  children: ReactNode;
  /** A heading of the outline's level, or "p" for a title-styled sentence that isn't a heading */
  component?: "h1" | "h2" | "h3" | "h4" | "h5" | "h6" | "p";
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
  hideOnScroll?: boolean;
  showOnScroll?: boolean;
}

export interface SelectLanguageButtonProps {
  label: string;
  value: keyof typeof DIRECTION_BY_LANGUAGE;
}

export interface SkillBarsProps {
  /** Sizes and places the list */
  className?: string;
}

export interface GetDirByLocaleProps {
  locale: string | string[];
}
