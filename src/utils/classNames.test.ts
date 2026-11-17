import classNames from "@utils/classNames";

describe("classNames", () => {
  it("joins class names with spaces", () => {
    expect(classNames("a", "b", "c")).toBe("a b c");
  });

  it("skips empty ones, so optional and conditional classes need no fallbacks", () => {
    const isOpen = false;
    expect(classNames("a", undefined, null, "", isOpen && "open", "b")).toBe("a b");
    expect(classNames(undefined)).toBe("");
  });
});
