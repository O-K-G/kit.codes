"use server";

import DOMPurify from "isomorphic-dompurify";
import nodemailer from "nodemailer";
import { handleValidation } from "./handleValidation";
import { convertComponentToHtml } from "./emailHTMLtemplate";

const STATUS = {
  success: { success: true, message: "Message sent" },
  fail: { success: false, message: "Message was not sent" },
};

type ActionState = {
  success: boolean;
  message: string;
  errors?: {
    from?: string[];
    subject?: string[];
    message?: string[];
    dir?: string[];
  };
} | null;

const { PASS, SERVICE, USER_NAME, TO, HOST_SUCCESS_RESPONSE } =
  process.env || {};

export async function sendEmail(
  _prevState: ActionState,
  data: FormData,
): Promise<ActionState> {
  const from = DOMPurify.sanitize((data?.get("fromInput") as string) || "");
  const subject = DOMPurify.sanitize(
    (data?.get("subjectInput") as string) || "",
  );

  const message = DOMPurify.sanitize(
    (data?.get("messageInput") as string) || "",
  );

  const dir = DOMPurify.sanitize((data?.get("fromDirection") as string) || "");
  const { success: validated } =
    (await handleValidation({ from, subject, message, dir })) || {};

  if (validated) {
    const transporter = nodemailer.createTransport({
      service: SERVICE,
      auth: {
        user: USER_NAME,
        pass: PASS,
      },
    });

    try {
      const transport = await transporter.sendMail({
        from,
        to: [TO!],
        subject,
        html: await convertComponentToHtml({ from, subject, message, dir }),
      });

      if (transport?.response?.includes(HOST_SUCCESS_RESPONSE!)) {
        return STATUS.success;
      }
    } catch (err) {
      console.error(err);

      return STATUS.fail;
    }
  }

  console.error(STATUS.fail);
  return STATUS.fail;
}
