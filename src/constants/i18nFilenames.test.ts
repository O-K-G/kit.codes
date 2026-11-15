import fs from "fs";
import path from "path";
import { CLIENT_NAMESPACES } from "@constants/i18nFilenames";

/** Every source file under src, but tests */
const sourceFiles = (dir: string): string[] =>
  fs.readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    const file = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      return sourceFiles(file);
    }
    return /\.tsx?$/.test(file) && !/\.test\./.test(file) ? [file] : [];
  });

describe("CLIENT_NAMESPACES", () => {
  it("includes every namespace a client component reads", () => {
    const missing = sourceFiles("src")
      .map((file) => fs.readFileSync(file, "utf8"))
      .filter((code) => /^\s*["']use client["']/.test(code))
      .flatMap((code) => [...code.matchAll(/useTranslations\(\s*["']([^"']+)["']/g)].map(([, ns]) => ns))
      .filter((namespace) => !(CLIENT_NAMESPACES as readonly string[]).includes(namespace));

    expect(missing).toEqual([]);
  });
});
