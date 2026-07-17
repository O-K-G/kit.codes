import type { Config } from "jest";
import nextJest from "next/jest.js";

const createJestConfig = nextJest({
  dir: "./",
});

const config: Config = {
  testEnvironment: "jest-environment-jsdom",
  setupFilesAfterEnv: ["<rootDir>/jest.setup.ts"],
  moduleNameMapper: {
    "^@/(.*)$": "<rootDir>/$1",
    "^@utils/(.*)$": "<rootDir>/app/utils/$1",
    "^@hooks/(.*)$": "<rootDir>/app/hooks/$1",
    "^@ui/(.*)$": "<rootDir>/app/ui/$1",
    "^@components(.*)$": "<rootDir>/app/components/$1",
    "^@constants(.*)$": "<rootDir>/app/constants/$1",
  },
  testPathIgnorePatterns: ["<rootDir>/.next/", "<rootDir>/node_modules/"],
  collectCoverageFrom: [
    "app/components/**/*.tsx",
    "app/ui/**/*.tsx",
    "app/hooks/**/*.tsx",
    "app/utils/**/*.tsx",
    "!app/**/*.constants.tsx",
  ],
};

export default createJestConfig(config);
