import nextCoreWebVitals from "eslint-config-next/core-web-vitals";
import nextTypescript from "eslint-config-next/typescript";
import globals from "globals";

const eslintConfig = [
  ...nextCoreWebVitals,
  ...nextTypescript,
  {
    languageOptions: {
      globals: { ...globals.jest },
    },
    rules: {
      "@typescript-eslint/no-unused-vars": "warn",
      "object-shorthand": ["warn"],
      "react/react-in-jsx-scope": "off",
      "@next/next/no-img-element": "off",
    },
  },
  // Not for TypeScript: these core rules don't understand types (they call type names undefined,
  // and parameters in type signatures unused). There, TypeScript and the rule above cover them.
  {
    files: ["**/*.{js,mjs,cjs,jsx}"],
    rules: {
      "no-unused-vars": "warn",
      "no-undef": "warn",
    },
  },
  {
    ignores: ["node_modules/**", ".next/**", "out/**", "build/**", "coverage/**", "next-env.d.ts"],
  },
];

export default eslintConfig;
