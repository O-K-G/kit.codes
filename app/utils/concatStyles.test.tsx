import { concatStyles } from "./concatStyles";

describe("concatStyles", () => {
  it("joins multiple class names with a space", () => {
    expect(concatStyles(["a", "b"])).toBe("a b");
  });

  it("joins three or more class names", () => {
    expect(concatStyles(["a", "b", "c"])).toBe("a b c");
  });

  it("returns a single class name unchanged", () => {
    expect(concatStyles(["solo"])).toBe("solo");
  });

  it("returns an empty string for an empty array", () => {
    expect(concatStyles([])).toBe("");
  });

  it("preserves empty string entries as double spaces", () => {
    expect(concatStyles(["a", "", "b"])).toBe("a  b");
  });

  it("does not trim whitespace within class names", () => {
    expect(concatStyles([" a ", "b"])).toBe(" a  b");
  });

  it("handles a single empty string", () => {
    expect(concatStyles([""])).toBe("");
  });

  it("preserves the order of class names", () => {
    expect(concatStyles(["z", "a", "m"])).toBe("z a m");
  });

  it("handles duplicate class names without de-duplication", () => {
    expect(concatStyles(["a", "a"])).toBe("a a");
  });

  it("handles class names containing spaces already", () => {
    expect(concatStyles(["a b", "c"])).toBe("a b c");
  });
});
