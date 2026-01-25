import { expect, test } from "@playwright/test";

test.beforeEach(async ({ page, context }) => {
  // Clear cookies/storage before each test
  await context.clearCookies();
  await page.goto("/");
});

test.describe("Sign Up", () => {
  test("successfully creates a new account and redirects to home", async ({
    page,
  }) => {
    const uniqueEmail = `test-${Date.now()}@example.com`;

    await page.goto("/sign-up");
    await page.waitForLoadState("networkidle");

    await expect(page.getByRole("heading", { name: "Sign Up" })).toBeVisible();

    await page.getByPlaceholder("Name").fill("Test User");
    await page.getByPlaceholder("m@example.com").fill(uniqueEmail);
    await page.getByPlaceholder("Password").fill("password123");

    await page.getByRole("button", { name: "Create an account" }).click();

    await expect(page).toHaveURL("/", { timeout: 10_000 });
    await expect(
      page.getByRole("link", { name: "Home", exact: true }),
    ).toBeVisible();
  });

  test("shows validation error for short password", async ({ page }) => {
    await page.goto("/sign-up");
    await page.waitForLoadState("networkidle");

    await page.getByPlaceholder("Name").fill("Test User");
    await page.getByPlaceholder("m@example.com").fill("test@example.com");
    await page.getByPlaceholder("Password").fill("12345");

    await page.getByRole("button", { name: "Create an account" }).click();

    await expect(
      page.getByText("Password must be at least 6 characters long"),
    ).toBeVisible();
  });

  test("shows validation error for short name", async ({ page }) => {
    await page.goto("/sign-up");
    await page.waitForLoadState("networkidle");

    await page.getByPlaceholder("Name").fill("T");
    await page.getByPlaceholder("m@example.com").fill("test@example.com");
    await page.getByPlaceholder("Password").fill("password123");

    await page.getByRole("button", { name: "Create an account" }).click();

    await expect(
      page.getByText("Name must be at least 2 characters long"),
    ).toBeVisible();
  });
});

test.describe("Sign In", () => {
  // Use seeded test user from database (see apps/server/scripts/seed-db.ts)
  const testUserEmail = "test@test.com";
  const testUserPassword = "test1234";

  test("successfully signs in and redirects to home", async ({ page }) => {
    await page.goto("/sign-in");
    await page.waitForLoadState("networkidle");

    await expect(page.getByRole("heading", { name: "Sign In" })).toBeVisible();

    await page.getByPlaceholder("m@example.com").fill(testUserEmail);
    await page.getByPlaceholder("Password").fill(testUserPassword);

    await page.getByRole("button", { name: "Login" }).click();

    await expect(page).toHaveURL("/", { timeout: 10_000 });
    await expect(
      page.getByRole("link", { name: "Home", exact: true }),
    ).toBeVisible();
  });

  test("shows validation error for short password", async ({ page }) => {
    await page.goto("/sign-in");
    await page.waitForLoadState("networkidle");

    await page.getByPlaceholder("m@example.com").fill("test@example.com");
    await page.getByPlaceholder("Password").fill("12345");

    await page.getByRole("button", { name: "Login" }).click();

    await expect(
      page.getByText("Password must be at least 6 characters long"),
    ).toBeVisible();
  });
});
