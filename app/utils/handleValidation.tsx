import { z } from "zod";

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
    from: z.email({ message: "Invalid email format" }),

    subject: z
      .string()
      .min(3, { message: "Subject must be at least 3 characters" })
      .max(100, { message: "Subject cannot exceed 100 characters" }),

    message: z
      .string()
      .min(3, { message: "Message must be at least 3 characters" })
      .max(1000, { message: "Message cannot exceed 1000 characters" }),

    dir: z.enum(["ltr", "rtl"], {
      message: "Direction must be either ltr or rtl",
    }),
  });

  return await emailSchema.safeParseAsync({ from, subject, message, dir });
}
