/** @jest-environment node */
import { sendMessage } from "@components/contact/sendMessage";

const sendMail = jest.fn();
jest.mock("nodemailer", () => ({
  __esModule: true,
  default: { createTransport: () => ({ sendMail }) },
}));

/** Each test sends from its own IP address, so the per-visitor limit doesn't carry over */
let visitorIp = "";
let ipCount = 0;
jest.mock("next/headers", () => ({
  headers: async () => new Headers({ "x-forwarded-for": `${visitorIp}, 10.0.0.1` }),
}));

const SETTINGS = { SERVICE: "gmail", USER_NAME: "site@example.com", PASS: "secret", TO: "me@example.com" };

/** The form as the browser sends it: shown 10 seconds ago, the honeypot empty */
function form(fields: Record<string, string>) {
  const data = new FormData();
  Object.entries({ startedAt: String(Date.now() - 10_000), website: "", ...fields }).forEach(
    ([key, value]) => data.append(key, value)
  );
  return data;
}

const VALID = { dir: "rtl", email: "visitor@example.com", subject: "Hi", content: "<b>Hello</b> there" };

beforeEach(() => {
  ipCount += 1;
  visitorIp = `203.0.113.${ipCount}`;
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

  it("trims the fields, and rejects ones made only of spaces", async () => {
    await sendMessage(form({ ...VALID, email: "  visitor@example.com ", subject: " Hi  " }));
    const mail = sendMail.mock.calls[0][0];
    expect(mail.replyTo).toBe(VALID.email);
    expect(mail.text.startsWith("Hi\n")).toBe(true);

    const result = await sendMessage(form({ ...VALID, subject: "   ", content: "\n\n" }));
    expect(result).toEqual({ ok: false, error: "invalid", fieldErrors: ["subject", "content"] });
  });

  it("keeps the message's line breaks in the HTML email", async () => {
    await sendMessage(form({ ...VALID, content: "Line one\n\nLine two" }));

    const { html } = sendMail.mock.calls[0][0];
    expect(html).toContain("white-space:pre-wrap");
    expect(html).toContain("Line one\n\nLine two");
  });

  it.each([
    ["the honeypot is filled in", { website: "https://spam.example" }],
    ["it's sent too soon after the form was shown", { startedAt: String(Date.now() - 500) }],
    ["it's sent without the time the form was shown", { startedAt: "" }],
  ])("pretends to send, without sending, when %s", async (_, botFields) => {
    expect(await sendMessage(form({ ...VALID, ...botFields }))).toEqual({ ok: true });
    expect(sendMail).not.toHaveBeenCalled();
  });

  it("limits each visitor to 5 messages, not counting invalid ones", async () => {
    await sendMessage(form({ ...VALID, email: "invalid" }));
    for (let i = 0; i < 5; i += 1) {
      expect(await sendMessage(form(VALID))).toEqual({ ok: true });
    }

    expect(await sendMessage(form(VALID))).toEqual({ ok: false, error: "rate-limited" });
    expect(sendMail).toHaveBeenCalledTimes(5);

    visitorIp = "198.51.100.1";
    expect(await sendMessage(form(VALID))).toEqual({ ok: true });
  });

  it("caps everyone's messages together at 30 an hour", async () => {
    // Earlier tests in this file already sent some; each visitor here stays under its own limit
    let result;
    for (let i = 0; i < 40; i += 1) {
      visitorIp = `192.0.2.${i}`;
      result = await sendMessage(form(VALID));
      if (!result.ok) break;
    }

    expect(result).toEqual({ ok: false, error: "rate-limited" });
  });
});
