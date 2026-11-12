import type { Page } from "@playwright/test";

import { test, expect } from "@playwright/test";

async function completeLesson(page: Page, number: number) {
  await page.bringToFront();
  const dialog = page.getByRole("dialog");
  // The server-rendered map can appear before its event handlers hydrate.
  await expect(async () => {
    await page
      .getByRole("button", { name: new RegExp(`^Уровень ${number}:`) })
      .press("Enter");
    await expect(dialog).toBeVisible({ timeout: 1_000 });
  }).toPass({ timeout: 10_000 });

  for (let question = 0; question < 3; question += 1) {
    await dialog.getByRole("button", { name: "Да", exact: true }).click();
    await dialog
      .getByRole("button", {
        name: question === 2 ? "Уровень пройден" : "Дальше",
        exact: true,
      })
      .click();
  }

  await expect(dialog).toHaveCount(0);
}

test("keeps completed lessons when another tab saves older progress", async ({
  page,
  context,
}) => {
  test.setTimeout(60_000);
  const otherPage = await context.newPage();
  for (const tab of [page, otherPage]) {
    await tab.goto("/ru/");
    await expect(
      tab.getByRole("heading", { name: "Пройдено 0 из 12" }),
    ).toBeVisible();
  }

  await completeLesson(page, 1);
  await completeLesson(otherPage, 2);

  for (const tab of [page, otherPage]) {
    await tab.reload();
    await expect(
      tab.getByRole("heading", { name: "Пройдено 2 из 12" }),
    ).toBeVisible();
    for (const number of [1, 2]) {
      await expect(
        tab.getByRole("button", { name: new RegExp(`^Уровень ${number}:`) }),
      ).toHaveAttribute("data-state", "passed");
    }
  }

  await completeLesson(otherPage, 1);
  await otherPage.reload();
  await expect(
    otherPage.getByRole("heading", { name: "Пройдено 2 из 12" }),
  ).toBeVisible();
});
