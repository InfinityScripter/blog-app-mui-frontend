import { test, expect } from "./fixtures";
import { getContrastRatio } from "@mui/material/styles";

/**
 * Public (unauthenticated) smoke flow.
 * Verifies the public shell, navigation, post detail deep-links, and that
 * blog data is fetched from the backend and rendered.
 */
test.describe("public pages", () => {
  test("home renders nav and hero", async ({ page }) => {
    await page.goto("/");
    await expect(page).toHaveTitle(/Talalaev/i);
    await expect(
      page.getByRole("link", { name: "Блог", exact: true }),
    ).toBeVisible();
    await expect(
      page.getByRole("link", { name: "Обо мне" }).first(),
    ).toBeVisible();
  });

  test("light theme keeps the auth logo readable on its dark panel", async ({
    page,
  }) => {
    await page.goto("/auth/jwt/sign-in");

    const logo = page.locator('[data-slot="logo"]');
    const panel = page.locator("main > div:first-child");

    await expect(logo).toBeVisible();
    await expect(panel).toBeVisible();

    const [tileColor, wordmarkColor, panelColor] = await Promise.all([
      logo
        .locator("svg > rect:first-child")
        .evaluate((element) => getComputedStyle(element).fill),
      logo
        .locator(":scope > span")
        .evaluate((element) => getComputedStyle(element).color),
      panel.evaluate((element) => getComputedStyle(element).backgroundColor),
    ]);

    expect(getContrastRatio(tileColor, panelColor)).toBeGreaterThanOrEqual(3);
    expect(getContrastRatio(wordmarkColor, panelColor)).toBeGreaterThanOrEqual(
      4.5,
    );
  });

  test("TIL tab switches without navigation or layout shift", async ({
    page,
  }) => {
    await page.goto("/library");

    const rscRequests: string[] = [];
    page.on("request", (request) => {
      if (new URL(request.url()).searchParams.has("_rsc")) {
        rscRequests.push(request.url());
      }
    });

    const tabs = page.getByRole("tablist");
    const til = page.getByRole("tab", { name: "TIL", exact: true });

    await expect(til).toBeVisible();
    await page.evaluate(() => window.scrollTo(0, 120));

    const beforeScrollY = await page.evaluate(() => window.scrollY);
    const beforeTabs = await tabs.boundingBox();
    if (!beforeTabs) throw new Error("Library tabs are not measurable");

    await til.click();

    await expect(page).toHaveURL(/[?&]tab=til(?:&|$)/);
    await expect(
      page.getByRole("heading", {
        name: "SWR не делает запрос, если ключ — null",
      }),
    ).toBeVisible();

    const afterTabs = await tabs.boundingBox();
    if (!afterTabs) throw new Error("Library tabs are not measurable");

    expect(await page.evaluate(() => window.scrollY)).toBe(beforeScrollY);
    expect(Math.abs(afterTabs.x - beforeTabs.x)).toBeLessThanOrEqual(1);
    expect(rscRequests).toEqual([]);
  });

  // A post *detail* link: under <main> (excludes the nav "Блог" link, whose
  // href ends at the list route), pointing at a slug below …/post/. Hrefs carry
  // a locale prefix (`localePrefix: "always"` → /ru/post/…, /en/post/…), so
  // match on the "/post/<slug>" segment rather than anchoring at the start.
  const detailLink = (page: import("@playwright/test").Page) =>
    page.locator('main a[href*="/post/"]:not([href$="/post/"])');

  test("blog list loads posts from the backend", async ({ page }) => {
    await page.goto("/post");
    await expect(page).toHaveTitle(/Блог/);
    // At least one post card with a title link to a post detail route.
    await expect(detailLink(page).first()).toBeVisible({ timeout: 15_000 });
  });

  test("post detail deep-link renders post content", async ({ page }) => {
    // First discover a real post id from the list.
    await page.goto("/post");
    const link = detailLink(page).first();
    await expect(link).toBeVisible({ timeout: 15_000 });
    const href = await link.getAttribute("href");
    expect(href).toBeTruthy();

    // Navigate directly (fresh load) to the detail route.
    await page.goto(href!);
    await expect(page).toHaveTitle(/Talalaev/i);
    // .first() — after hydration the comments section can match more than one
    // node; we only need to confirm the post detail rendered. The heading is
    // Russian ("Комментарии").
    await expect(
      page.getByText("Комментарии", { exact: false }).first(),
    ).toBeVisible();
  });

  test("unknown route shows 404 view", async ({ page }) => {
    await page.goto("/this-route-does-not-exist-zzz");
    await expect(page.getByText(/404|not found|Sorry/i).first()).toBeVisible();
  });
});
