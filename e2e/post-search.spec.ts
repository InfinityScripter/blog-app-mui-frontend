import type { Page } from "@playwright/test";
import type { Post } from "../src/types/domain";

import { test, expect } from "@playwright/test";

const firstPost: Post = {
  _id: "search-first",
  title: "Первый результат",
  publish: "published",
  tags: [],
  metaKeywords: [],
  totalViews: 0,
  totalShares: 0,
  totalComments: 0,
  totalFavorites: 0,
  favoritePerson: [],
  comments: [],
  userId: "search-author",
  author: { name: "Автор" },
};
const secondPost: Post = {
  ...firstPost,
  _id: "search-second",
  title: "Второй результат",
};

async function openSearch(page: Page) {
  await page.clock.install();
  await page.route("**/api/post/list**", (route) =>
    route.fulfill({ json: { posts: [] } }),
  );
  await page.route("**/api/post/search**", (route) =>
    route.fulfill({ json: { results: [firstPost] } }),
  );
  await page.route("**/api/auth/me", (route) =>
    route.fulfill({ json: { user: null } }),
  );
  const hydrated = page.waitForResponse("**/api/auth/me");
  await page.goto("/ru/privacy-policy/", { waitUntil: "domcontentloaded" });
  await hydrated;
  await page.getByRole("button", { name: "Открыть поиск" }).click();
  const dialog = page.getByRole("dialog");
  const input = dialog.getByRole("textbox");
  await input.fill("first");
  await expect(
    dialog.getByText(firstPost.title, { exact: true }),
  ).toBeVisible();
  await page.clock.pauseAt(new Date(Date.now() + 1000));
  return { dialog, input };
}

for (const nextQuery of ["second", ""]) {
  test(`Enter ignores the previous query during debounce (${nextQuery || "cleared"})`, async ({
    page,
  }) => {
    const { dialog, input } = await openSearch(page);
    await input.fill(nextQuery);
    await input.press("Enter");
    await page.clock.runFor(100);
    await expect(dialog).toBeVisible();
    await expect(page).toHaveURL(/\/ru\/privacy-policy\/$/);
  });
}

test("Enter waits for the current response, then opens its first result", async ({
  page,
}) => {
  const { dialog, input } = await openSearch(page);
  const nextRequest = page.waitForRequest(
    (request) => new URL(request.url()).searchParams.get("query") === "second",
  );
  let releaseResponse = () => {};
  const responseReady = new Promise<void>((resolve) => {
    releaseResponse = resolve;
  });
  await page.route("**/api/post/search**", async (route) => {
    await responseReady;
    await route.fulfill({ json: { results: [secondPost] } });
  });
  await input.fill("second");
  await page.clock.runFor(501);
  await nextRequest;
  try {
    await input.press("Enter");
    await page.clock.runFor(100);
    await expect(dialog).toBeVisible();
    await expect(page).toHaveURL(/\/ru\/privacy-policy\/$/);
  } finally {
    releaseResponse();
  }

  await expect(
    dialog.getByText(secondPost.title, { exact: true }),
  ).toBeVisible();
  await page.clock.resume();
  await input.press("Enter");
  await expect(dialog).not.toBeVisible();
  await expect(page).toHaveURL(/\/ru\/post\/search-second\/?$/);
});

for (const status of [503, 200]) {
  test(`Enter stays in search after a ${status === 503 ? "failed" : "empty"} response`, async ({
    page,
  }) => {
    const { dialog, input } = await openSearch(page);
    await page.route("**/api/post/search**", (route) =>
      route.fulfill({
        status,
        json: status === 503 ? { message: "Unavailable" } : { results: [] },
      }),
    );
    const response = page.waitForResponse(
      (result) => new URL(result.url()).searchParams.get("query") === "second",
    );
    await input.fill("second");
    await page.clock.runFor(501);
    await response;
    await expect(dialog.getByText(/^esc$/i)).toBeVisible();
    await input.press("Enter");
    await page.clock.runFor(100);
    await expect(dialog).toBeVisible();
    await expect(page).toHaveURL(/\/ru\/privacy-policy\/$/);
  });
}
