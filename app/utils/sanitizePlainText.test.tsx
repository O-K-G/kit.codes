import { sanitizePlainText } from "./sanitizePlainText";

describe("sanitizePlainText", () => {
  it("returns clean text unchanged", () => {
    expect(sanitizePlainText("hello world")).toBe("hello world");
  });

  it("strips a simple HTML tag", () => {
    expect(sanitizePlainText("<b>bold</b>")).toBe("bold");
  });

  it("strips a script injection attempt", () => {
    expect(sanitizePlainText("<script>alert(1)</script>")).toBe("alert(1)");
  });

  it("strips self-closing tags", () => {
    expect(sanitizePlainText("line1<br/>line2")).toBe("line1line2");
  });

  it("strips tags with attributes", () => {
    expect(sanitizePlainText('<a href="evil.com">click</a>')).toBe("click");
  });

  it("strips multiple tags across the string", () => {
    expect(sanitizePlainText("<p>a</p><p>b</p>")).toBe("ab");
  });

  it("returns an empty string unchanged", () => {
    expect(sanitizePlainText("")).toBe("");
  });

  it("leaves a lone unmatched '<' unaffected when there is no closing '>'", () => {
    expect(sanitizePlainText("3 < 5")).toBe("3 < 5");
  });

  it("strips nested tags", () => {
    expect(sanitizePlainText("<div><span>x</span></div>")).toBe("x");
  });

  it("does not remove non-tag angle-bracket-free text containing symbols", () => {
    expect(sanitizePlainText("100% & great!")).toBe("100% & great!");
  });

  it("strips an img tag with an onerror attribute (XSS vector)", () => {
    expect(sanitizePlainText('<img src=x onerror="alert(1)">')).toBe("");
  });
});
