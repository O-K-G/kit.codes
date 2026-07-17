import { handleOpenExternalWindow } from "./handleOpenExternalWindow";

describe("handleOpenExternalWindow", () => {
  let openSpy: jest.SpyInstance;

  beforeEach(() => {
    openSpy = jest.spyOn(window, "open").mockImplementation(() => null);
  });

  afterEach(() => {
    openSpy.mockRestore();
  });

  it("calls window.open with the given url", () => {
    handleOpenExternalWindow("https://example.com");
    expect(openSpy).toHaveBeenCalledWith(
      "https://example.com",
      "_blank",
      "noreferrer",
    );
  });

  it("always opens in a new tab (_blank)", () => {
    handleOpenExternalWindow("https://a.com");
    expect(openSpy.mock.calls[0][1]).toBe("_blank");
  });

  it("always sets the noreferrer feature", () => {
    handleOpenExternalWindow("https://a.com");
    expect(openSpy.mock.calls[0][2]).toBe("noreferrer");
  });

  it("calls window.open exactly once per invocation", () => {
    handleOpenExternalWindow("https://a.com");
    expect(openSpy).toHaveBeenCalledTimes(1);
  });

  it("passes through a mailto: link unchanged", () => {
    handleOpenExternalWindow("mailto:test@example.com");
    expect(openSpy).toHaveBeenCalledWith(
      "mailto:test@example.com",
      "_blank",
      "noreferrer",
    );
  });

  it("passes through a relative path unchanged", () => {
    handleOpenExternalWindow("/about");
    expect(openSpy).toHaveBeenCalledWith("/about", "_blank", "noreferrer");
  });

  it("passes through an empty string without throwing", () => {
    expect(() => handleOpenExternalWindow("")).not.toThrow();
    expect(openSpy).toHaveBeenCalledWith("", "_blank", "noreferrer");
  });

  it("does not return a value", () => {
    const result = handleOpenExternalWindow("https://a.com");
    expect(result).toBeUndefined();
  });

  it("invokes window.open again on a second, different call", () => {
    handleOpenExternalWindow("https://a.com");
    handleOpenExternalWindow("https://b.com");
    expect(openSpy).toHaveBeenCalledTimes(2);
    expect(openSpy).toHaveBeenNthCalledWith(
      2,
      "https://b.com",
      "_blank",
      "noreferrer",
    );
  });

  it("handles a URL containing query params and fragments", () => {
    const url = "https://example.com/page?x=1&y=2#section";
    handleOpenExternalWindow(url);
    expect(openSpy).toHaveBeenCalledWith(url, "_blank", "noreferrer");
  });
});
