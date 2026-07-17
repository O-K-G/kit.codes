import { convertComponentToHtml } from "./emailHTMLtemplate";

const BASE_PROPS = {
  from: "sender@example.com",
  subject: "Hello",
  message: "Hi there",
  dir: "ltr",
};

describe("convertComponentToHtml", () => {
  it("returns a string", async () => {
    const html = await convertComponentToHtml(BASE_PROPS);
    expect(typeof html).toBe("string");
  });

  it("includes a doctype declaration", async () => {
    const html = await convertComponentToHtml(BASE_PROPS);
    expect(html).toMatch(/<!DOCTYPE html>/i);
  });

  it("includes the html, head, and body tags", async () => {
    const html = await convertComponentToHtml(BASE_PROPS);
    expect(html).toContain("<html>");
    expect(html).toContain("<head>");
    expect(html).toContain("<body>");
  });

  it("includes a utf-8 charset meta tag", async () => {
    const html = await convertComponentToHtml(BASE_PROPS);
    expect(html).toContain('charset="utf-8"');
  });

  it("embeds the subject text", async () => {
    const html = await convertComponentToHtml(BASE_PROPS);
    expect(html).toContain("Hello");
  });

  it("embeds the from text", async () => {
    const html = await convertComponentToHtml(BASE_PROPS);
    expect(html).toContain("sender@example.com");
  });

  it("embeds the message text", async () => {
    const html = await convertComponentToHtml(BASE_PROPS);
    expect(html).toContain("Hi there");
  });

  it("sets the dir attribute on the outer container", async () => {
    const html = await convertComponentToHtml({ ...BASE_PROPS, dir: "rtl" });
    expect(html).toContain('dir="rtl"');
  });

  it("HTML-escapes message content to avoid breaking markup", async () => {
    const html = await convertComponentToHtml({
      ...BASE_PROPS,
      message: "<script>alert(1)</script>",
    });
    expect(html).not.toContain("<script>alert(1)</script>");
    expect(html).toContain("&lt;script&gt;");
  });

  it("HTML-escapes the subject content", async () => {
    const html = await convertComponentToHtml({
      ...BASE_PROPS,
      subject: "<b>bold</b>",
    });
    expect(html).not.toContain("<b>bold</b>");
  });

  it("produces trimmed output with no leading/trailing whitespace", async () => {
    const html = await convertComponentToHtml(BASE_PROPS);
    expect(html).toBe(html.trim());
  });

  it("renders distinct output for distinct inputs", async () => {
    const htmlA = await convertComponentToHtml(BASE_PROPS);
    const htmlB = await convertComponentToHtml({
      ...BASE_PROPS,
      subject: "Different subject",
    });
    expect(htmlA).not.toBe(htmlB);
  });
});
