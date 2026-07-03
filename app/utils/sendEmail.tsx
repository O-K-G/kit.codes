import nodemailer from "nodemailer";

type SendEmailProps = {
  /** '"Example Sender" <sender@example.com>' */
  from: string;
  subject: string;
  text: string;
};

const { PASS, SERVICE, USER_NAME, TO, HOST_SUCCESS_RESPONSE } =
  process.env || {};

export async function sendEmail({ from, subject, text }: SendEmailProps) {
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
      text,
    });

    if (transport?.response?.includes(HOST_SUCCESS_RESPONSE!)) {
      const response = new Response(null, {
        status: 200,
        statusText: "OK",
        headers: {
          "Content-Type": "text/plain",
          Connection: "close",
        },
      });

      return response;
    }
  } catch (err) {
    console.error(err);
    const body = "501 Not Implemented: This feature is unavailable.";

    const errorResponse = new Response(body, {
      status: 501,
      statusText: "Not Implemented",
      headers: {
        "Content-Type": "text/plain; charset=utf-8",
        Connection: "close",
      },
    });

    return errorResponse;
  }
}
