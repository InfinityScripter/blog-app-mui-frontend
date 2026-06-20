import { resolve } from "node:path";

import { test, expect, NON_ADMIN_USER } from "./fixtures";

/**
 * Account operations through the dashboard UI (/dashboard/user/account):
 * - update display name
 * - upload avatar, then remove it
 * - change password (then change it back so the seeded creds stay valid)
 * - reject a wrong current password
 *
 * Runs as the seeded non-admin user. global-setup re-seeds that user (name +
 * password hash) on every run with ON CONFLICT DO UPDATE, so name/avatar
 * mutations here are self-healing. The password test restores the original
 * password within the test to keep the suite re-runnable in one DB.
 *
 * Assertions target durable outcomes (persisted values, control state) rather
 * than the transient success toast, which sonner auto-dismisses and which races
 * the assertion poll.
 */

const AVATAR = resolve(__dirname, "fixtures-files/cover.png");
const ACCOUNT_URL = "/dashboard/user/account";

test.describe("Account — general (name + avatar)", () => {
  test("updates the display name", async ({ nonAdminPage: page }) => {
    await page.goto(ACCOUNT_URL);

    const nameField = page.locator('input[name="name"]');
    await expect(nameField).toBeVisible({ timeout: 15_000 });

    const newName = `Test User ${Date.now()}`;
    await nameField.fill(newName);
    await page.getByRole("button", { name: "Сохранить изменения" }).click();

    // The save refreshes the auth session; the new name shows in the account
    // drawer header. This proves PATCH /api/user/profile + checkUserSession ran.
    await expect(page.getByRole("heading", { name: newName })).toBeVisible({
      timeout: 15_000,
    });

    // The value survives a reload (persisted server-side + re-fetched).
    await page.reload();
    await expect(page.locator('input[name="name"]')).toHaveValue(newName, {
      timeout: 15_000,
    });
  });

  test("selects an avatar, saves it, then removes it", async ({
    nonAdminPage: page,
  }) => {
    await page.goto(ACCOUNT_URL);
    await expect(page.locator('input[name="name"]')).toBeVisible({
      timeout: 15_000,
    });

    // Pick a file via the hidden dropzone input. UploadAvatar shows a preview
    // and the "Удалить фото" control appears as soon as a value exists.
    await page.locator('input[type="file"]').first().setInputFiles(AVATAR);
    const removeButton = page.getByRole("button", { name: "Удалить фото" });
    await expect(removeButton).toBeVisible({ timeout: 15_000 });

    // Persist: this uploads the file then POSTs /api/user/avatar. Assert the
    // request succeeds rather than relying on the (image-validated) preview.
    const avatarSave = page.waitForResponse(
      (r) =>
        r.url().includes("/api/user/avatar") && r.request().method() === "POST",
      { timeout: 20_000 },
    );
    await page.getByRole("button", { name: "Сохранить изменения" }).click();
    expect((await avatarSave).status()).toBe(200);

    // Remove: DELETE /api/user/avatar clears it; the button then disappears.
    const avatarDelete = page.waitForResponse(
      (r) =>
        r.url().includes("/api/user/avatar") &&
        r.request().method() === "DELETE",
      { timeout: 20_000 },
    );
    await page.getByRole("button", { name: "Удалить фото" }).click();
    expect((await avatarDelete).status()).toBe(200);

    await expect(page.getByRole("button", { name: "Удалить фото" })).toBeHidden(
      { timeout: 15_000 },
    );
  });
});

test.describe("Account — security (password)", () => {
  test("changes the password and rejects a wrong current password", async ({
    nonAdminPage: page,
  }) => {
    const NEW_PASSWORD = "@user1-changed";

    await page.goto(ACCOUNT_URL);
    await page.getByRole("tab", { name: "Безопасность" }).click();

    const current = page.locator('input[name="currentPassword"]');
    const next = page.locator('input[name="newPassword"]');
    const confirm = page.locator('input[name="confirmNewPassword"]');
    await expect(current).toBeVisible({ timeout: 15_000 });

    // 1) Wrong current password → backend 400 surfaced on the field.
    await current.fill("definitely-wrong");
    await next.fill(NEW_PASSWORD);
    await confirm.fill(NEW_PASSWORD);
    await page.getByRole("button", { name: "Изменить пароль" }).click();
    await expect(
      page.getByText(/Current password is incorrect|неверн/i),
    ).toBeVisible({ timeout: 15_000 });

    // 2) Correct current password → the form clears on success (reset()).
    await current.fill(NON_ADMIN_USER.password);
    await next.fill(NEW_PASSWORD);
    await confirm.fill(NEW_PASSWORD);
    await page.getByRole("button", { name: "Изменить пароль" }).click();
    await expect(current).toHaveValue("", { timeout: 15_000 });

    // 3) Restore the original password so the seeded credentials remain valid
    //    for re-runs / other specs in the same database.
    await current.fill(NEW_PASSWORD);
    await next.fill(NON_ADMIN_USER.password);
    await confirm.fill(NON_ADMIN_USER.password);
    await page.getByRole("button", { name: "Изменить пароль" }).click();
    await expect(current).toHaveValue("", { timeout: 15_000 });
  });
});
