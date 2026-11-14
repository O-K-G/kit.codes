import nodemailer, { Transporter } from "nodemailer";
import mailHTMLTemplate from "@utils/mailHTMLTemplate";
import mailHTMLText from "@i18nEn/mailHTMLText.json";
import { ContactMessage } from "@constants/interfaces";

/**
 * Server-only: sends contact messages through the mail account set in the environment (SERVICE,
 * USER_NAME, PASS) to the address in TO. Not a server action: only `sendMessage` calls it.
 */

let transporter: Transporter | undefined;

/** The mail account's settings; throws if any is missing, rather than failing later in nodemailer */
function getMailSettings() {
  const { SERVICE: service, USER_NAME: user, PASS: pass, TO: to } = process.env;

  if (!service || !user || !pass || !to) {
    throw new Error("Contact form: SERVICE, USER_NAME, PASS and TO must all be set.");
  }

  return { service, user, pass, to };
}

/**
 * Sends a contact message. It comes from the site's own account (sending "from" the visitor's
 * address would be spoofing it: providers reject or junk such mail), with the visitor's address
 * as the reply-to. Resolves once the mail server accepted it; rejects otherwise.
 */
export async function sendContactMail({ dir, email, subject, content }: ContactMessage) {
  const { service, user, pass, to } = getMailSettings();
  const { subject: subjectText, website } = mailHTMLText;

  transporter ??= nodemailer.createTransport({ service, auth: { user, pass } });

  const { accepted, rejected } = await transporter.sendMail({
    from: { name: `${website} contact form`, address: user },
    replyTo: email,
    to,
    subject: `${subjectText}: ${website}`,
    text: `${subject}\n\n${content}\n\n${email}`,
    html: await mailHTMLTemplate({ dir, email, subject, content }),
  });

  if (!accepted.length || rejected.length) {
    throw new Error(`Contact form: the mail server didn't accept the message (rejected: ${rejected.join(", ")})`);
  }
}
