/** @jest-environment node */
import { sendMessage } from "@components/contact/sendMessage";

const sendMail = jest.fn();
jest.mock("nodemailer", () => ({
  __esModule: true,
  default: { createTransport: () => ({ sendMail }) },
}));

const SETTINGS = { SERVICE: "gmail", USER_NAME: "site@example.com", PASS: "secret", TO: "me@example.com" };

function form(fields: Record<string, string>) {
  const data = new FormData();
  Object.entries(fields).forEach(([key, value]) => data.append(key, value));
  return data;
}

const VALID = { dir: "rtl", email: "visitor@example.com", subject: "Hi", content: "<b>Hello</b> there" };

beforeEach(() => {
  sendMail.mockReset().mockResolvedValue({ accepted: [SETTINGS.TO], rejected: [] });
  Object.assign(process.env, SETTINGS);
  jest.spyOn(console, "error").mockImplementation(() => undefined);
});

describe("sendMessage (the contact form's server action)", () => {
  it("rejects invalid fields without sending, naming them", async () => {
    const result = await sendMessage(form({ email: "not an email", subject: "", content: "x" }));

    expect(result).toEqual({ ok: false, error: "invalid", fieldErrors: ["email", "subject"] });
    expect(sendMail).not.toHaveBeenCalled();
  });

  it("sends from the site's account, with the visitor as the reply-to, their text escaped", async () => {
    const result = await sendMessage(form(VALID));

    expect(result).toEqual({ ok: true });
    const mail = sendMail.mock.calls[0][0];
    expect(mail.from).toEqual(expect.objectContaining({ address: SETTINGS.USER_NAME }));
    expect(mail.replyTo).toBe(VALID.email);
    expect(mail.to).toBe(SETTINGS.TO);
    expect(mail.html).toContain('dir="rtl"');
    expect(mail.html).toContain("&lt;b&gt;Hello&lt;/b&gt; there");
    expect(mail.html).not.toContain("<b>Hello</b>");
  });

  it("falls back to left-to-right for an unknown text direction", async () => {
    await sendMessage(form({ ...VALID, dir: "sideways" }));

    expect(sendMail.mock.calls[0][0].html).toContain('dir="ltr"');
  });

  it("reports a failed send (refused, or rejected by the mail server) instead of throwing", async () => {
    sendMail.mockRejectedValueOnce(new Error("SMTP down"));
    expect(await sendMessage(form(VALID))).toEqual({ ok: false, error: "send-failed" });

    sendMail.mockResolvedValueOnce({ accepted: [], rejected: [SETTINGS.TO] });
    expect(await sendMessage(form(VALID))).toEqual({ ok: false, error: "send-failed" });
  });

  it("reports a missing mail setting as a failed send", async () => {
    delete process.env.PASS;

    expect(await sendMessage(form(VALID))).toEqual({ ok: false, error: "send-failed" });
    expect(sendMail).not.toHaveBeenCalled();
  });
});
