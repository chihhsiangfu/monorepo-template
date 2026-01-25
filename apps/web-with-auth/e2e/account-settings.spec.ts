import { expect, test } from "@playwright/test";

// Use seeded test user from database (see apps/server/scripts/seed-db.ts)
const testUserEmail = "test@test.com";
const testUserPassword = "test1234";

async function signIn(page: import("@playwright/test").Page) {
  await page.goto("/sign-in");
  await page.waitForLoadState("networkidle");
  await page.getByPlaceholder("m@example.com").fill(testUserEmail);
  await page.getByPlaceholder("Password").fill(testUserPassword);
  await page.getByRole("button", { name: "Login" }).click();
  await expect(page).toHaveURL("/", { timeout: 10_000 });
}

test.describe("Account Settings", () => {
  test.beforeEach(async ({ page, context }) => {
    await context.clearCookies();
    await signIn(page);
    await page.goto("/account-settings");
    await page.waitForLoadState("networkidle");
  });

  test("displays account settings page with all sections", async ({ page }) => {
    await expect(
      page.getByRole("heading", { name: "Account Settings" }),
    ).toBeVisible();
    await expect(page.getByRole("heading", { name: "Profile" })).toBeVisible();
    await expect(
      page.getByRole("heading", { name: "Change Password" }),
    ).toBeVisible();
    await expect(
      page.getByRole("heading", { name: "Danger Zone" }),
    ).toBeVisible();
  });

  test("shows current user info in profile section", async ({ page }) => {
    // Use the paragraph element in the profile section (not the sidebar)
    await expect(
      page.getByRole("paragraph").filter({ hasText: testUserEmail }),
    ).toBeVisible();
  });

  test("updates profile name successfully", async ({ page }) => {
    const newName = `Test User ${Date.now()}`;

    await page.getByPlaceholder("Your name").clear();
    await page.getByPlaceholder("Your name").fill(newName);
    await page.getByRole("button", { name: "Save changes" }).click();

    // Wait for toast notification
    await expect(page.getByText("User updated successfully")).toBeVisible({
      timeout: 5000,
    });
  });

  test("shows validation error for short name in profile", async ({ page }) => {
    await page.getByPlaceholder("Your name").clear();
    await page.getByPlaceholder("Your name").fill("A");
    await page.getByRole("button", { name: "Save changes" }).click();

    await expect(
      page.getByText("Name must be at least 2 characters long"),
    ).toBeVisible();
  });

  test("shows validation error for invalid avatar URL", async ({ page }) => {
    await page
      .getByPlaceholder("https://example.com/avatar.jpg")
      .fill("not-a-url");
    await page.getByRole("button", { name: "Save changes" }).click();

    await expect(page.getByText("Please enter a valid URL")).toBeVisible();
  });

  test("shows validation error for short password in change password", async ({
    page,
  }) => {
    await page.getByPlaceholder("Enter current password").fill("12345");
    await page.getByPlaceholder("Enter new password").fill("12345");
    await page.getByPlaceholder("Confirm new password").fill("12345");
    await page.getByRole("button", { name: "Change password" }).click();

    await expect(
      page.getByText("Password must be at least 6 characters long").first(),
    ).toBeVisible();
  });

  test("shows validation error when passwords do not match", async ({
    page,
  }) => {
    await page.getByPlaceholder("Enter current password").fill("password123");
    await page.getByPlaceholder("Enter new password").fill("newpassword123");
    await page.getByPlaceholder("Confirm new password").fill("differentpass");
    await page.getByRole("button", { name: "Change password" }).click();

    await expect(page.getByText("Passwords do not match")).toBeVisible();
  });

  test("opens delete account confirmation dialog", async ({ page }) => {
    await page
      .getByRole("button", { name: "Delete Account", exact: false })
      .click();

    await expect(
      page.getByRole("heading", { name: "Are you absolutely sure?" }),
    ).toBeVisible();
    await expect(page.getByText("This action cannot be undone")).toBeVisible();
    await expect(page.getByRole("button", { name: "Cancel" })).toBeVisible();
  });

  test("closes delete account dialog on cancel", async ({ page }) => {
    await page
      .getByRole("button", { name: "Delete Account", exact: false })
      .click();

    await expect(
      page.getByRole("heading", { name: "Are you absolutely sure?" }),
    ).toBeVisible();

    await page.getByRole("button", { name: "Cancel" }).click();

    await expect(
      page.getByRole("heading", { name: "Are you absolutely sure?" }),
    ).not.toBeVisible();
  });
});
