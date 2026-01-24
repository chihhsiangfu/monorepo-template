import { expect, test } from "@playwright/test";

test.describe("Sign Up", () => {
  test("successfully creates a new account and redirects to home", async ({
    page,
  }) => {
    const uniqueEmail = `test-${Date.now()}@example.com`;

    await page.goto("/sign-up");
    await page.waitForLoadState("networkidle");

    await expect(page.getByRole("heading", { name: "Sign Up" })).toBeVisible();

    await page.getByPlaceholder("Please enter your name").fill("Test User");
    await page.getByPlaceholder("Please enter your email").fill(uniqueEmail);
    await page
      .getByPlaceholder("Please enter your password")
      .fill("password123");

    await page.getByRole("button", { name: "Sign Up" }).click();

    await expect(page).toHaveURL("/", { timeout: 10_000 });
    await expect(
      page.getByRole("link", { name: "Home", exact: true }),
    ).toBeVisible();
  });

  test("shows validation error for short password", async ({ page }) => {
    await page.goto("/sign-up");
    await page.waitForLoadState("networkidle");

    await page.getByPlaceholder("Please enter your name").fill("Test User");
    await page
      .getByPlaceholder("Please enter your email")
      .fill("test@example.com");
    await page.getByPlaceholder("Please enter your password").fill("12345");

    await page.getByRole("button", { name: "Sign Up" }).click();

    await expect(
      page.getByText("Password must be at least 6 characters long"),
    ).toBeVisible();
  });

  test("shows validation error for short name", async ({ page }) => {
    await page.goto("/sign-up");
    await page.waitForLoadState("networkidle");

    await page.getByPlaceholder("Please enter your name").fill("T");
    await page
      .getByPlaceholder("Please enter your email")
      .fill("test@example.com");
    await page
      .getByPlaceholder("Please enter your password")
      .fill("password123");

    await page.getByRole("button", { name: "Sign Up" }).click();

    await expect(
      page.getByText("Name must be at least 2 characters long"),
    ).toBeVisible();
  });
});

test.describe("Sign In", () => {
  // Use the seeded test user from the database
  const testUserEmail = "test@test.com";
  const testUserPassword = "test1234";

  test("successfully signs in and redirects to home", async ({ page }) => {
    await page.goto("/sign-in");
    await page.waitForLoadState("networkidle");

    await expect(page.getByRole("heading", { name: "Sign In" })).toBeVisible();

    await page.getByPlaceholder("Please enter your email").fill(testUserEmail);
    await page
      .getByPlaceholder("Please enter your password")
      .fill(testUserPassword);

    await page.getByRole("button", { name: "Sign In" }).click();

    await expect(page).toHaveURL("/", { timeout: 10_000 });
    await expect(
      page.getByRole("link", { name: "Home", exact: true }),
    ).toBeVisible();
  });

  test("shows validation error for short password", async ({ page }) => {
    await page.goto("/sign-in");
    await page.waitForLoadState("networkidle");

    await page
      .getByPlaceholder("Please enter your email")
      .fill("test@example.com");
    await page.getByPlaceholder("Please enter your password").fill("12345");

    await page.getByRole("button", { name: "Sign In" }).click();

    await expect(
      page.getByText("Password must be at least 6 characters long"),
    ).toBeVisible();
  });
});
