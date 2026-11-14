"use server";

import { z } from "zod";
import { ContactMessageSchema, FormErrorNames, SendMessageResult } from "@constants/interfaces";
import { sendContactMail } from "@utils/mail";

/**
 * The contact form's server action: validates the message again (the browser's check can be
 * bypassed) and sends it. Resolves to what happened, for the form to show; never throws.
 */
export async function sendMessage(formData: FormData): Promise<SendMessageResult> {
  const parsed = ContactMessageSchema.safeParse({
    dir: formData.get("dir"),
    email: formData.get("email"),
    subject: formData.get("subject"),
    content: formData.get("content"),
  });

  if (!parsed.success) {
    const fieldErrors = Object.keys(z.flattenError(parsed.error).fieldErrors) as FormErrorNames;
    return { ok: false, error: "invalid", fieldErrors };
  }

  try {
    await sendContactMail(parsed.data);
    return { ok: true };
  } catch (error) {
    console.error(error);
    return { ok: false, error: "send-failed" };
  }
}
