import { defineConfig } from "vitest/config";
import path from "path";

export default defineConfig({
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "src"),
    },
  },
  test: {
    include: ["tests/**/*.test.ts"],
    globals: true,
    testTimeout: 60000,
    hookTimeout: 120000,
    sequence: { concurrent: false },
  },
});
