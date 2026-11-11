"use server";

import nodemailer from "nodemailer";
import mailHTMLTemplate from "@utils/mailHTMLTemplate";
import mailHTMLText from "@i18nEn/mailHTMLText.json";
import { MailHTMLTemplateProps } from "@constants/interfaces";

export default async function mailConfig({
  dir,
  email,
  subject,
  content,
}: MailHTMLTemplateProps) {
  const { env } = process;
  const { SERVICE: service, USER_NAME: user, PASS: pass, TO: to } = env;
  const { subject: subjectText, website } = mailHTMLText;

  const transporter = nodemailer.createTransport({
    service,
    auth: {
      user,
      pass,
    },
  });

  const messageSendDetailsObject = {
    from: `"${email}" <${email}>`,
    to,
    subject: `${subjectText}: ${website}`,
    text: `${content}`,
    html: await mailHTMLTemplate({ dir, email, subject, content }),
  };

  return { transporter, messageSendDetailsObject };
}
