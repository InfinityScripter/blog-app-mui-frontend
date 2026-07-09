import { test, expect } from "./fixtures";

/**
 * Authentication + guard smoke flow.
 */
test.describe("auth & guards", () => {
  test("AuthGuard redirects logged-out users to sign-in with returnTo", async ({
    page,
  }) => {
    await page.goto("/dashboard");
    // `trailingSlash: true` in next.config.mjs normalises the path to
    // `/auth/jwt/sign-in/` and the returnTo to `%2Fdashboard%2F`.
    await expect(page).toHaveURL(
      /\/auth\/jwt\/sign-in\/?\?returnTo=%2Fdashboard/,
    );
    await expect(
      page.getByRole("button", { name: "Войти", exact: true }),
    ).toBeVisible();
  });

  test("sign-in sets the httpOnly access_token cookie and lands on the dashboard", async ({
    authedPage,
  }) => {
    // The authedPage fixture already performed the login.
    await expect(authedPage).toHaveURL(/\/dashboard/);

    // Auth rides in an httpOnly cookie (not sessionStorage) after the
    // cookie-auth migration, so assert the cookie is present in the context.
    const cookies = await authedPage.context().cookies();
    const accessCookie = cookies.find((c) => c.name === "access_token");
    expect(accessCookie, "access_token cookie should be set").toBeTruthy();
    expect(accessCookie?.httpOnly, "access_token must be httpOnly").toBe(true);
  });

  test("admin posts page lists all posts (not just the admin's own)", async ({
    authedPage,
  }) => {
    await authedPage.goto("/dashboard/admin/posts");
    // Should NOT be bounced back to sign-in (admin role passes RoleBasedGuard).
    await expect(authedPage).not.toHaveURL(/\/sign-in/);
    await expect(authedPage).toHaveURL(/\/dashboard\/admin\/posts/);

    // The "Все посты" table must contain at least one data row.
    // Regression guard: backend /api/post/list must return ALL posts for admins,
    // not only posts the admin personally authored (was filtered by userId).
    // Before the fix the demo admin (who authored 0 posts) saw an empty table.
    await expect(
      authedPage.getByRole("heading", { name: "Все посты" }),
    ).toBeVisible();
    // The seeded post is authored by "Hello Friend" (NOT the logged-in admin),
    // so its cell only appears if the endpoint returns every post. Asserting on
    // the cell text auto-waits for the SWR fetch to populate the table body.
    // .first() — there can be several such posts; strict mode would otherwise
    // reject the multi-match.
    await expect(
      authedPage.locator("table tbody").getByText("Hello Friend").first(),
    ).toBeVisible({ timeout: 15_000 });
  });

  test("non-admin is blocked from the admin posts page by RoleBasedGuard", async ({
    nonAdminPage,
  }) => {
    await nonAdminPage.goto("/dashboard/admin/posts");
    // RoleBasedGuard renders a "Permission denied" view instead of the table.
    await expect(
      nonAdminPage.getByRole("heading", { name: "Permission denied" }),
    ).toBeVisible({ timeout: 15_000 });
    await expect(
      nonAdminPage.getByRole("heading", { name: "Все посты" }),
    ).toHaveCount(0);
  });

  test("non-admin blog list shows only their own posts", async ({
    nonAdminPage,
  }) => {
    // Regression guard for the backend list endpoint: an authenticated
    // non-admin must see only posts they authored, never other users' posts.
    await nonAdminPage.goto("/dashboard/post");
    await expect(
      nonAdminPage.getByText("Test User own post").first(),
    ).toBeVisible({ timeout: 15_000 });
    // The admin-authored seed post must NOT appear for this user.
    await expect(nonAdminPage.getByText("Illo accusamus non e")).toHaveCount(0);
  });
});
