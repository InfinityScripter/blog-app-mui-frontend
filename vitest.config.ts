import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    // Весь src: точечный список директорий молча терял тесты, добавленные в
    // не перечисленные места (actions/, hooks/, auth/, layouts/).
    include: ["src/**/*.test.{ts,tsx}"],
    environment: "node",
  },
  resolve: {
    alias: { src: new URL("./src", import.meta.url).pathname },
  },
});
