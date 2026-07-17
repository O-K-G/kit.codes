import { handleValidation, FIELDS } from "./handleValidation";

const VALID = {
  from: "test@example.com",
  subject: "Hello there",
  message: "This is a valid message.",
  dir: "ltr" as const,
};

describe("handleValidation", () => {
  it("succeeds for fully valid input", async () => {
    const result = await handleValidation(VALID);
    expect(result.success).toBe(true);
  });

  it("fails for a malformed email", async () => {
    const result = await handleValidation({ ...VALID, from: "not-an-email" });
    expect(result.success).toBe(false);
  });

  it("fails when the email exceeds FIELDS.email.maxLength", async () => {
    const localPart = "a".repeat(FIELDS.email.maxLength);
    const from = `${localPart}@example.com`;
    expect(from.length).toBeGreaterThan(FIELDS.email.maxLength);
    const result = await handleValidation({ ...VALID, from });
    expect(result.success).toBe(false);
  });

  it("fails when the email contains a line break", async () => {
    const result = await handleValidation({
      ...VALID,
      from: "test@example.com\nBcc: evil@example.com",
    });
    expect(result.success).toBe(false);
  });

  it("fails when the subject is shorter than FIELDS.subject.minLength", async () => {
    const result = await handleValidation({ ...VALID, subject: "ab" });
    expect(result.success).toBe(false);
  });

  it("fails when the subject exceeds FIELDS.subject.maxLength", async () => {
    const result = await handleValidation({
      ...VALID,
      subject: "a".repeat(FIELDS.subject.maxLength + 1),
    });
    expect(result.success).toBe(false);
  });

  it("accepts a subject exactly at FIELDS.subject.maxLength", async () => {
    const result = await handleValidation({
      ...VALID,
      subject: "a".repeat(FIELDS.subject.maxLength),
    });
    expect(result.success).toBe(true);
  });

  it("fails when the message is shorter than FIELDS.message.minLength", async () => {
    const result = await handleValidation({ ...VALID, message: "ab" });
    expect(result.success).toBe(false);
  });

  it("fails when the message exceeds FIELDS.message.maxLength", async () => {
    const result = await handleValidation({
      ...VALID,
      message: "a".repeat(FIELDS.message.maxLength + 1),
    });
    expect(result.success).toBe(false);
  });

  it("fails for a dir value outside 'ltr' | 'rtl'", async () => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const result = await handleValidation({ ...VALID, dir: "sideways" as any });
    expect(result.success).toBe(false);
  });

  it("accepts 'rtl' as a valid dir", async () => {
    const result = await handleValidation({ ...VALID, dir: "rtl" });
    expect(result.success).toBe(true);
  });

  it("returns per-field error messages via safeParseAsync's error.issues", async () => {
    const result = await handleValidation({
      from: "bad-email",
      subject: "ab",
      message: "ab",
      dir: "ltr",
    });
    expect(result.success).toBe(false);
    if (!result.success) {
      const paths = result.error.issues.map((issue) => issue.path[0]);
      expect(paths).toEqual(
        expect.arrayContaining(["from", "subject", "message"]),
      );
    }
  });

  it("rejects a subject containing a line break", async () => {
    const result = await handleValidation({
      ...VALID,
      subject: "line one\nline two",
    });
    expect(result.success).toBe(false);
  });
});
