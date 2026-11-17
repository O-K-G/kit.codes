import nextJest from "next/jest.js";
import { Config } from "jest";

const createJestConfig = nextJest({
  dir: "./",
});

const config: Config = {
  clearMocks: true,
  collectCoverage: true,
  coverageDirectory: "coverage",
  coverageProvider: "v8",
  testPathIgnorePatterns: [
    "<rootDir>/node_modules/",
    "<rootDir>/playwright-tests/",
  ],
  setupFilesAfterEnv: ["<rootDir>/jest.setup.ts"],
  testEnvironment: "jsdom",
};

async function customConfig() {
  // https://stackoverflow.com/questions/50147915/jest-transformignorepatterns-not-working
  const nextJestConfig = await createJestConfig(config)();
  (nextJestConfig.transformIgnorePatterns as string[])[0] =
    "node_modules/(?!next-intl)/";
  return nextJestConfig;
}

export default customConfig;
