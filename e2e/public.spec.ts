import { test, expect } from "./fixtures";

/**
 * Public (unauthenticated) smoke flow.
 * Verifies the public shell, navigation, post detail deep-links, and that
 * blog data is fetched from the backend and rendered.
 */
test.describe("public pages", () => {
  test("home renders nav and hero", async ({ page }) => {
    await page.goto("/");
    await expect(page).toHaveTitle(/Mihail Talalaev/i);
    await expect(
      page.getByRole("link", { name: "Блог", exact: true }),
    ).toBeVisible();
    await expect(
      page.getByRole("link", { name: "Портфолио" }).first(),
    ).toBeVisible();
  });

  // A post *detail* link: under <main> (excludes the nav "Блог" link whose
  // href is "/post/"), pointing at a slug below /post/.
  const detailLink = (page: import("@playwright/test").Page) =>
    page.locator('main a[href^="/post/"]:not([href$="/post/"])');

  test("blog list loads posts from the backend", async ({ page }) => {
    await page.goto("/post");
    await expect(page).toHaveTitle(/Post list/i);
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
    await expect(page).toHaveTitle(/Post details/i);
    // .first() — after hydration the comments section can match more than one
    // node; we only need to confirm the post detail rendered.
    await expect(
      page.getByText("Comments", { exact: false }).first(),
    ).toBeVisible();
  });

  test("unknown route shows 404 view", async ({ page }) => {
    await page.goto("/this-route-does-not-exist-zzz");
    await expect(page.getByText(/404|not found|Sorry/i).first()).toBeVisible();
  });
});
