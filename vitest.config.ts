import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    include: [
      "src/server/llm-stats/**/*.test.ts",
      "src/components/**/*.test.ts",
      "src/utils/**/*.test.ts",
      "src/routes/**/*.test.ts",
      "src/sections/**/*.test.ts",
    ],
    environment: "node",
  },
  resolve: {
    alias: { src: new URL("./src", import.meta.url).pathname },
  },
});
