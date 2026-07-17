describe("handleFonts", () => {
  it("does not throw when the module is imported", async () => {
    await expect(import("./handleFonts")).resolves.toBeDefined();
  });

  it("exports FONTS_VARIABLES", async () => {
    const mod = await import("./handleFonts");
    expect(mod).toHaveProperty("FONTS_VARIABLES");
  });

  it("FONTS_VARIABLES is currently an empty string", async () => {
    const { FONTS_VARIABLES } = await import("./handleFonts");
    expect(FONTS_VARIABLES).toBe("");
  });

  it("FONTS_VARIABLES is of type string", async () => {
    const { FONTS_VARIABLES } = await import("./handleFonts");
    expect(typeof FONTS_VARIABLES).toBe("string");
  });

  it("does not export the underscore-prefixed local font objects", async () => {
    const mod = await import("./handleFonts");
    expect(mod).not.toHaveProperty("_bigShoulders");
    expect(mod).not.toHaveProperty("_inter");
    expect(mod).not.toHaveProperty("_jetBrainsMono");
  });

  it("only exposes FONTS_VARIABLES as a named export", async () => {
    const mod = await import("./handleFonts");
    expect(Object.keys(mod)).toEqual(["FONTS_VARIABLES"]);
  });

  it("does not export a default export", async () => {
    const mod = await import("./handleFonts");
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    expect((mod as any).default).toBeUndefined();
  });

  it("evaluates the module (and its localFont calls) without logging errors", async () => {
    const errorSpy = jest.spyOn(console, "error").mockImplementation(() => {});
    await import("./handleFonts");
    expect(errorSpy).not.toHaveBeenCalled();
    errorSpy.mockRestore();
  });

  it("returns the same FONTS_VARIABLES value across repeated imports (module singleton)", async () => {
    const first = await import("./handleFonts");
    const second = await import("./handleFonts");
    expect(first.FONTS_VARIABLES).toBe(second.FONTS_VARIABLES);
  });

  it("FONTS_VARIABLES has zero length", async () => {
    const { FONTS_VARIABLES } = await import("./handleFonts");
    expect(FONTS_VARIABLES).toHaveLength(0);
  });

  it("FONTS_VARIABLES is falsy, meaning it is not yet wired into any className", async () => {
    const { FONTS_VARIABLES } = await import("./handleFonts");
    expect(FONTS_VARIABLES).toBeFalsy();
  });
});
