import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  // Override default ignores of eslint-config-next.
  globalIgnores([
    // Default ignores of eslint-config-next:
    ".next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
    // Local QA/dev artifacts (mirrors .gitignore qa-* patterns):
    "qa-screenshots/**",
    "qa-verify-latest/**",
    "qa-admin-screenshots/**",
    "qa-prod-screenshots/**",
    "qa-admin-form.mjs",
    "qa-verify-latest.mjs",
    "qa-filters.mjs",
    "qa-prod.mjs",
  ]),
]);

export default eslintConfig;
