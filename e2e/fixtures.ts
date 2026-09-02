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

  // An account whose personal-data consent is missing or on an older revision
  // gets HTTP 428 instead of a session: the form keeps the credentials, reveals
  // the consent checkbox and expects a SECOND submit. A seeded account has no
  // consent on file, so without this step every authenticated spec just sat on
  // /sign-in until the timeout. Walk the same two-step path a real user walks
  // rather than back-dooring consent into the DB.
  const consentCheckbox = page.getByRole("checkbox", {
    name: /согласен на обработку персональных данных/i,
  });

  // Whichever comes first: the guard redirecting (consent already on file) or
  // the consent prompt appearing.
  await Promise.race([
    page
      .waitForURL((url) => !url.pathname.includes("/sign-in"), {
        timeout: 30_000,
      })
      .catch(() => {}),
    consentCheckbox
      .waitFor({ state: "visible", timeout: 30_000 })
      .catch(() => {}),
  ]);

  if (await consentCheckbox.isVisible()) {
    await consentCheckbox.check();
    await page.getByRole("button", { name: "Войти", exact: true }).click();
  }

  // After a successful login the guard redirects away from the sign-in page.
  // 30s: the first dashboard visit may hit a cold dev-server compile.
  await page.waitForURL((url) => !url.pathname.includes("/sign-in"), {
    timeout: 30_000,
  });
}

/**
 * Прод-смоук (E2E_BASE_URL задан) обязан быть строго read-only: все не-GET
 * запросы к /api/ и все маяки Vercel Analytics (/_vercel/*) блокируются на
 * уровне браузера, чтобы прогоны не писали в прод — ни в данные (счётчики
 * просмотров — fire-and-forget с catch, аборт безвреден), ни в статистику
 * трафика. Локальных прогонов guard не касается.
 *
 * Плюс кука NEXT_LOCALE=ru: middleware сеет локаль по x-vercel-ip-country
 * РАНЬШЕ Accept-Language, а раннер GitHub — в US, так что без куки прод
 * отдал бы /en и все русские getByRole-запросы падали бы.
 */
const PROD_SMOKE_URL = process.env.E2E_BASE_URL;

/**
 * `authedPage` logs in via the real sign-in form before the test body runs,
 * so authenticated routes (dashboard, admin) are reachable.
 */
export const test = base.extend<{
  authedPage: import("@playwright/test").Page;
  nonAdminPage: import("@playwright/test").Page;
}>({
  page: async ({ page }, use) => {
    if (PROD_SMOKE_URL) {
      await page.context().addCookies([
        {
          name: "NEXT_LOCALE",
          value: "ru",
          url: PROD_SMOKE_URL,
        },
      ]);
      await page.route("**/_vercel/**", (route) => route.abort());
      await page.route("**/api/**", (route) =>
        route.request().method() === "GET" ? route.continue() : route.abort(),
      );
    }
    await use(page);
  },
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
