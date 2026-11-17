"use server";

import { z } from "zod";
import { headers } from "next/headers";
import {
  CONTACT_FORM_HONEYPOT_NAME,
  CONTACT_FORM_STARTED_AT_NAME,
  ContactMessageSchema,
  FormErrorNames,
  SendMessageResult,
} from "@constants/interfaces";
import { sendContactMail } from "@utils/mail";
import { createRateLimiter } from "@utils/rateLimit";

const MINUTE = 60 * 1000;

/** People rarely write a message in under this; bots fill the form in at once */
const MIN_FILL_TIME_MS = 3000;

/** Per visitor: 5 messages every 15 minutes */
const perVisitor = createRateLimiter({ limit: 5, windowMs: 15 * MINUTE });

/**
 * For everyone together: 30 messages an hour. A cap on the mail sent whatever the visitors' IP
 * addresses, which a bot can rotate (or forge, when no proxy sets X-Forwarded-For).
 */
const overall = createRateLimiter({ limit: 30, windowMs: 60 * MINUTE });

/** The visitor's IP address, as the proxy in front of the server reports it */
async function getVisitorIp() {
  const requestHeaders = await headers();
  const forwardedFor = requestHeaders.get("x-forwarded-for")?.split(",")[0]?.trim();

  return forwardedFor || requestHeaders.get("x-real-ip") || "unknown";
}

/**
 * Whether a bot sent the form: it filled in the hidden honeypot field, or sent the form too soon
 * after it was shown (or without the time it was shown).
 */
function isBot(formData: FormData) {
  const honeypot = formData.get(CONTACT_FORM_HONEYPOT_NAME);
  const startedAt = Number(formData.get(CONTACT_FORM_STARTED_AT_NAME));

  return (
    (typeof honeypot === "string" && honeypot !== "") ||
    !Number.isFinite(startedAt) ||
    startedAt <= 0 ||
    Date.now() - startedAt < MIN_FILL_TIME_MS
  );
}

/**
 * The contact form's server action: turns bots away, validates the message again (the browser's
 * check can be bypassed), limits how often it's used, and sends it. Resolves to what happened, for
 * the form to show; never throws.
 */
export async function sendMessage(formData: FormData): Promise<SendMessageResult> {
  // A bot is told it worked, so it has no reason to try again differently
  if (isBot(formData)) return { ok: true };

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

  // Counted only for messages that would be sent; the visitor's limit is checked first, so one
  // visitor's spam doesn't use up everyone's
  if (!perVisitor.hit(await getVisitorIp()) || !overall.hit("all")) {
    return { ok: false, error: "rate-limited" };
  }

  try {
    await sendContactMail(parsed.data);
    return { ok: true };
  } catch (error) {
    console.error(error);
    return { ok: false, error: "send-failed" };
  }
}
