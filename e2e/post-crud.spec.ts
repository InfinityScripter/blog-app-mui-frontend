import { resolve } from "node:path";

import { test, expect } from "./fixtures";

/**
 * Full post CRUD through the real dashboard UI:
 * create (form + Tiptap + cover upload + autocompletes) → view → edit → delete.
 *
 * The post is created and deleted within the test, so it cleans up after
 * itself. Runs serially because the steps share one created post.
 */
test.describe.configure({ mode: "serial" });

const COVER = resolve(__dirname, "fixtures-files/cover.png");

const CONTENT =
  "This is e2e content long enough to satisfy the 100 character minimum " +
  "validation rule for the post body field, with room to spare.";

async function fillPostForm(
  page: import("@playwright/test").Page,
  data: { title: string; description: string },
) {
  await page.getByRole("textbox", { name: "Заголовок поста" }).fill(data.title);
  await page
    .getByRole("textbox", { name: "Описание", exact: true })
    .fill(data.description);

  const editor = page.locator(".ProseMirror").first();
  await editor.click();
  await page.keyboard.press("ControlOrMeta+A");
  await page.keyboard.press("Backspace");
  await editor.pressSequentially(CONTENT);

  await page.locator('input[type="file"]').first().setInputFiles(COVER);

  const tags = page.getByRole("combobox", { name: "Теги" });
  await tags.click();
  await tags.fill("Tech");
  await page.keyboard.press("Enter");
  await tags.fill("News");
  await page.keyboard.press("Enter");

  const keywords = page.getByRole("combobox", { name: "Мета-ключевые слова" });
  await keywords.click();
  await keywords.fill("e2e");
  await page.keyboard.press("Enter");
}

test.describe("post CRUD (dashboard UI)", () => {
  // Unique per run so the suite never collides with leftover data.
  const title = `E2E CRUD ${Date.now()}`;
  const editedTitle = `${title} (edited)`;
  let postId = "";

  test("create a post through the form", async ({ authedPage }) => {
    const page = authedPage;
    await page.goto("/dashboard/post/new");

    await fillPostForm(page, { title, description: "E2E created post." });

    const created = page.waitForResponse(
      (r) =>
        r.url().includes("/api/post/new") && r.request().method() === "POST",
    );
    await page.getByRole("button", { name: "Создать пост" }).click();
    const response = await created;
    expect(response.status()).toBe(201);

    // Redirected to the dashboard post list (trailingSlash: true).
    await expect(page).toHaveURL(/\/dashboard\/post\/?$/);

    // The new post shows up in the admin "Все посты" table.
    await page.goto("/dashboard/admin/posts");
    const row = page.locator("table tbody tr", { hasText: title });
    await expect(row).toBeVisible({ timeout: 15_000 });

    // Capture the post id from its edit button navigation target.
    await row.getByRole("button", { name: "Редактировать" }).click();
    await expect(page).toHaveURL(/\/dashboard\/post\/[^/]+\/edit\/?$/);
    postId = page.url().match(/\/post\/([^/]+)\/edit\/?$/)?.[1] ?? "";
    expect(postId, "should have captured a post id").toBeTruthy();
  });

  test("view the post on the public page", async ({ page }) => {
    expect(postId).toBeTruthy();
    await page.goto(`/post/${postId}`);
    await expect(page).toHaveTitle(/Post details/i);
    await expect(page.getByRole("heading", { name: title })).toBeVisible({
      timeout: 15_000,
    });
    await expect(page.getByText(CONTENT.slice(0, 40))).toBeVisible();
  });

  test("edit the post through the form", async ({ authedPage }) => {
    const page = authedPage;
    expect(postId).toBeTruthy();
    await page.goto(`/dashboard/post/${postId}/edit`);

    const titleField = page.getByRole("textbox", { name: "Заголовок поста" });
    await expect(titleField).toHaveValue(title, { timeout: 15_000 });
    await titleField.fill(editedTitle);

    const updated = page.waitForResponse(
      (r) =>
        r.url().includes(`/api/post/${postId}/edit`) &&
        r.request().method() === "PUT",
    );
    await page.getByRole("button", { name: "Сохранить изменения" }).click();
    const response = await updated;
    expect(response.status()).toBe(200);

    await expect(page).toHaveURL(/\/dashboard\/post\/?$/);

    // Public page reflects the new title.
    await page.goto(`/post/${postId}`);
    await expect(page.getByRole("heading", { name: editedTitle })).toBeVisible({
      timeout: 15_000,
    });
  });

  test("delete the post from the admin table", async ({ authedPage }) => {
    const page = authedPage;
    expect(postId).toBeTruthy();
    await page.goto("/dashboard/admin/posts");

    const row = page.locator("table tbody tr", { hasText: editedTitle });
    await expect(row).toBeVisible({ timeout: 15_000 });

    // The delete handler uses window.confirm — accept it.
    page.once("dialog", (dialog) => dialog.accept());

    const deleted = page.waitForResponse(
      (r) =>
        r.url().includes(`/api/admin/posts/${postId}`) &&
        r.request().method() === "DELETE",
    );
    await row.getByRole("button", { name: "Удалить" }).click();
    const response = await deleted;
    expect(response.status()).toBe(200);

    // Row disappears.
    await expect(
      page.locator("table tbody tr", { hasText: editedTitle }),
    ).toHaveCount(0, { timeout: 15_000 });

    // Public detail page no longer resolves to the post.
    await page.goto(`/post/${postId}`);
    await expect(page.getByRole("heading", { name: editedTitle })).toHaveCount(
      0,
    );
  });
});
