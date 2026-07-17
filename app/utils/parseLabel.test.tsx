import { parseLabel } from "./parseLabel";

describe("parseLabel", () => {
  it("removes non-alphabetic characters", () => {
    expect(parseLabel("abc123")).toBe("abc");
  });

  it("lowercases the result", () => {
    expect(parseLabel("ABC")).toBe("abc");
  });

  it("strips spaces", () => {
    expect(parseLabel("Hello World")).toBe("helloworld");
  });

  it("strips punctuation and symbols", () => {
    expect(parseLabel("hi! there?")).toBe("hithere");
  });

  it("returns an empty string for an all-numeric input", () => {
    expect(parseLabel("12345")).toBe("");
  });

  it("returns an empty string for an empty string input", () => {
    expect(parseLabel("")).toBe("");
  });

  it("handles mixed case with symbols and numbers together", () => {
    expect(parseLabel("Track-ID_42")).toBe("trackid");
  });

  it("leaves a purely alphabetic lowercase string unchanged", () => {
    expect(parseLabel("already")).toBe("already");
  });

  it("returns an empty string for whitespace-only input", () => {
    expect(parseLabel("   ")).toBe("");
  });

  it("strips unicode/accented letters since they are outside a-zA-Z", () => {
    expect(parseLabel("café")).toBe("caf");
  });

  it("handles falsy input without throwing (optional chaining)", () => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    expect(parseLabel(undefined as any)).toBeUndefined();
  });
});
