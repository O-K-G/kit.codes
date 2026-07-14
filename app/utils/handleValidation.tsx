import { z } from "zod";

const NO_LINE_BREAKS = /^[^\r\n]*$/;

export const FIELDS = {
  email: {
    minLength: 3,
    maxLength: 254,
  },
  subject: {
    minLength: 3,
    maxLength: 100,
  },
  message: {
    minLength: 3,
    maxLength: 1000,
  },
  track: {
    minLength: 0,
    maxLength: 50,
  },
};

type HandleValidationProps = {
  from: string;
  subject: string;
  message: string;
  dir: string;
};

export async function handleValidation({
  from,
  subject,
  message,
  dir,
}: HandleValidationProps) {
  const emailSchema = z.object({
    from: z
      .email({ message: "Invalid email format" })
      .min(FIELDS.email.minLength, {
        message: `Email must be at least ${FIELDS.email.minLength} characters`,
      })
      .max(FIELDS.email.maxLength, {
        message: `Email cannot exceed ${FIELDS.email.maxLength} characters`,
      })
      .regex(NO_LINE_BREAKS, { message: "Email cannot contain line breaks" }),

    subject: z
      .string()
      .min(FIELDS.subject.minLength, {
        message: "Subject must be at least 3 characters",
      })
      .max(FIELDS.subject.maxLength, {
        message: "Subject cannot exceed 100 characters",
      })
      .regex(NO_LINE_BREAKS, {
        message: "Subject cannot contain line breaks",
      }),

    message: z
      .string()
      .min(FIELDS.message.minLength, {
        message: "Message must be at least 3 characters",
      })
      .max(FIELDS.message.maxLength, {
        message: "Message cannot exceed 1000 characters",
      }),

    dir: z.enum(["ltr", "rtl"], {
      message: "Direction must be either ltr or rtl",
    }),
  });

  return await emailSchema.safeParseAsync({ from, subject, message, dir });
}
