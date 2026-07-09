import { resolve } from "node:path";

import { defineConfig, devices } from "@playwright/test";

/**
 * Playwright e2e config for the Next.js app.
 *
 * Requirements before running:
 *  - Backend API must be running on http://localhost:7272 (see ../blog-app-mui-backend).
 *  - PostgreSQL must be up with the seeded `blog_app` database.
 *
 * Playwright auto-starts the Next dev server on E2E_PORT (default 3055) via
 * `webServer`. Set E2E_PROD=1 to run against a production build (`next build`
 * then `next start`), which mirrors deployed Vercel behaviour more closely
 * (ISR/static caching, real metadata) at the cost of an upfront build.
 *
 * 3055 keeps e2e off the dev port (3033). The backend allows any localhost
 * origin for CORS, so client-side auth works from this port too.
 */

const PORT = Number(process.env.E2E_PORT ?? 3055);
const BASE_URL = `http://localhost:${PORT}`;
const PROD = process.env.E2E_PROD === "1";

// Invoke the local Next binary directly: the webServer command runs via
// `/bin/sh`, which has neither node_modules/.bin on PATH nor a predictable cwd.
const nextBin = resolve(__dirname, "node_modules/.bin/next");
const devCommand = `${nextBin} dev -p ${PORT}`;
const prodCommand = `${nextBin} build && ${nextBin} start -p ${PORT}`;

export default defineConfig({
  testDir: "./e2e",
  globalSetup: "./e2e/global-setup.ts",
  // Run serially. The specs share a backend + one created post and the Next
  // dev server compiles routes lazily on first hit; running fully parallel
  // races the cold compile and flakes (a different spec fails each run, all
  // pass in isolation). One worker keeps the suite reliably green.
  fullyParallel: false,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 1,
  workers: 1,
  reporter: process.env.CI ? "list" : [["list"], ["html", { open: "never" }]],
  timeout: 30_000,
  expect: { timeout: 10_000 },
  use: {
    baseURL: BASE_URL,
    trace: "on-first-retry",
    screenshot: "only-on-failure",
    // The specs assert Russian accessible names ("Заголовок поста", "Войти",
    // …). With `localePrefix: "always"` and no edge-geo header in local dev,
    // next-intl negotiates the locale from Accept-Language — Playwright's
    // default (en-US) would resolve English labels and fail every role query.
    // Pin the browser to Russian so the negotiated locale matches the specs.
    locale: "ru-RU",
    extraHTTPHeaders: { "Accept-Language": "ru-RU,ru;q=0.9" },
  },
  projects: [
    {
      name: "chromium",
      use: { ...devices["Desktop Chrome"] },
    },
  ],
  webServer: {
    command: PROD ? prodCommand : devCommand,
    url: BASE_URL,
    reuseExistingServer: !process.env.CI,
    // Next cold dev compile (or a full prod build) can take a while.
    timeout: PROD ? 300_000 : 180_000,
  },
});
