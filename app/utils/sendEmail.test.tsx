const sendMailMock = jest.fn();
const createTransportMock = jest.fn(() => ({ sendMail: sendMailMock }));

jest.mock("nodemailer", () => ({
  __esModule: true,
  default: {
    createTransport: (...args: unknown[]) => createTransportMock(...args),
  },
}));

type SendEmailFn = typeof import("./sendEmail").sendEmail;

async function loadSendEmail(): Promise<SendEmailFn> {
  const mod = await import("./sendEmail");
  return mod.sendEmail;
}

function buildFormData(fields: Record<string, string>): FormData {
  const fd = new FormData();
  Object.entries(fields).forEach(([key, value]) => fd.set(key, value));
  return fd;
}

const VALID_FIELDS = {
  fromInput: "test@example.com",
  subjectInput: "Hello there",
  messageInput: "This is a valid message.",
  fromDirection: "ltr",
};

describe("sendEmail", () => {
  let sendEmail: SendEmailFn;

  beforeAll(() => {
    process.env.PASS = "test-pass";
    process.env.SERVICE = "gmail";
    process.env.USER_NAME = "sender@example.com";
    process.env.TO = "recipient@example.com";
    process.env.HOST_SUCCESS_RESPONSE = "250 OK";
  });

  beforeEach(async () => {
    jest.clearAllMocks();
    sendMailMock.mockReset();
    createTransportMock.mockClear();
    sendEmail = await loadSendEmail();
  });

  it("returns success and skips sendMail when the honeypot 'trackInput' field is filled", async () => {
    jest.useFakeTimers();
    const promise = sendEmail(
      null,
      buildFormData({ ...VALID_FIELDS, trackInput: "bot-filled-this" }),
    );
    await jest.advanceTimersByTimeAsync(3000);
    const result = await promise;

    expect(result).toEqual({ success: true, message: "Message sent" });
    expect(sendMailMock).not.toHaveBeenCalled();
    jest.useRealTimers();
  });

  it("sanitizes the honeypot field: HTML-only trackInput is treated as empty and proceeds normally", async () => {
    sendMailMock.mockResolvedValue({ response: "250 OK from host" });

    const result = await sendEmail(
      null,
      buildFormData({ ...VALID_FIELDS, trackInput: "<div></div>" }),
    );

    expect(result).toEqual({ success: true, message: "Message sent" });
    expect(sendMailMock).toHaveBeenCalledTimes(1);
  });

  it("returns success when sendMail resolves with a response containing HOST_SUCCESS_RESPONSE", async () => {
    sendMailMock.mockResolvedValue({ response: "250 OK from host" });

    const result = await sendEmail(null, buildFormData(VALID_FIELDS));

    expect(result).toEqual({ success: true, message: "Message sent" });
  });

  it("returns failure when sendMail resolves with a response missing HOST_SUCCESS_RESPONSE", async () => {
    sendMailMock.mockResolvedValue({ response: "550 rejected" });

    const result = await sendEmail(null, buildFormData(VALID_FIELDS));

    expect(result).toEqual({ success: false, message: "Message not sent" });
  });

  it("returns failure and does not throw when sendMail rejects", async () => {
    sendMailMock.mockRejectedValue(new Error("SMTP down"));
    const errorSpy = jest.spyOn(console, "error").mockImplementation(() => {});

    const result = await sendEmail(null, buildFormData(VALID_FIELDS));

    expect(result).toEqual({ success: false, message: "Message not sent" });
    errorSpy.mockRestore();
  });

  it("does not call sendMail when validation fails (invalid email)", async () => {
    const errorSpy = jest.spyOn(console, "error").mockImplementation(() => {});

    const result = await sendEmail(
      null,
      buildFormData({ ...VALID_FIELDS, fromInput: "not-an-email" }),
    );

    expect(sendMailMock).not.toHaveBeenCalled();
    expect(result).toEqual({ success: false, message: "Message not sent" });
    errorSpy.mockRestore();
  });

  it("does not call sendMail when the message is too short", async () => {
    const errorSpy = jest.spyOn(console, "error").mockImplementation(() => {});

    const result = await sendEmail(
      null,
      buildFormData({ ...VALID_FIELDS, messageInput: "ab" }),
    );

    expect(sendMailMock).not.toHaveBeenCalled();
    expect(result).toEqual({ success: false, message: "Message not sent" });
    errorSpy.mockRestore();
  });

  it("sanitizes HTML tags out of subject/message/from before sending", async () => {
    sendMailMock.mockResolvedValue({ response: "250 OK from host" });

    await sendEmail(
      null,
      buildFormData({
        ...VALID_FIELDS,
        subjectInput: "<b>Hello</b> there",
      }),
    );

    const callArgs = sendMailMock.mock.calls[0][0];
    expect(callArgs.subject).toBe("Hello there");
  });

  it("sends to the TO env var wrapped in an array", async () => {
    sendMailMock.mockResolvedValue({ response: "250 OK from host" });

    await sendEmail(null, buildFormData(VALID_FIELDS));

    const callArgs = sendMailMock.mock.calls[0][0];
    expect(callArgs.to).toEqual(["recipient@example.com"]);
  });

  it("creates the transporter using SERVICE, USER_NAME, and PASS from the environment", async () => {
    sendMailMock.mockResolvedValue({ response: "250 OK from host" });

    await sendEmail(null, buildFormData(VALID_FIELDS));

    expect(createTransportMock).toHaveBeenCalledWith({
      service: "gmail",
      auth: { user: "sender@example.com", pass: "test-pass" },
    });
  });

  it("treats missing form fields as empty strings and fails validation rather than throwing", async () => {
    const errorSpy = jest.spyOn(console, "error").mockImplementation(() => {});

    const result = await sendEmail(null, new FormData());

    expect(result).toEqual({ success: false, message: "Message not sent" });
    expect(sendMailMock).not.toHaveBeenCalled();
    errorSpy.mockRestore();
  });
});
