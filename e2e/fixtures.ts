import { test as base, expect } from "@playwright/test";

/**
 * Admin credentials for the seeded demo account (`demo@minimals.cc`, role:
 * admin). The password matches the provisioned local/CI admin. Override with
 * E2E_ADMIN_PASSWORD if a given environment seeds a different one.
 */
export const DEMO_USER = {
  email: "demo@minimals.cc",
  password: process.env.E2E_ADMIN_PASSWORD ?? "Demo!Admin2026",
} as const;

/**
 * Non-admin user seeded for role-guard tests. Created by e2e/seed.ts.
 */
export const NON_ADMIN_USER = {
  email: "user@demo.cc",
  password: "@user1",
} as const;

async function login(
  page: import("@playwright/test").Page,
  creds: { email: string; password: string },
) {
  await page.goto("/auth/jwt/sign-in");
  await page.getByRole("textbox", { name: "Email" }).fill(creds.email);
  await page.locator('input[name="password"]').fill(creds.password);
  await page.getByRole("button", { name: "Войти", exact: true }).click();
  // After a successful login the guard redirects away from the sign-in page.
  // 30s: the first dashboard visit may hit a cold dev-server compile.
  await page.waitForURL((url) => !url.pathname.includes("/sign-in"), {
    timeout: 30_000,
  });
}

/**
 * `authedPage` logs in via the real sign-in form before the test body runs,
 * so authenticated routes (dashboard, admin) are reachable.
 */
export const test = base.extend<{
  authedPage: import("@playwright/test").Page;
  nonAdminPage: import("@playwright/test").Page;
}>({
  authedPage: async ({ page }, use) => {
    await login(page, DEMO_USER);
    await use(page);
  },
  nonAdminPage: async ({ page }, use) => {
    await login(page, NON_ADMIN_USER);
    await use(page);
  },
});

export { expect };
