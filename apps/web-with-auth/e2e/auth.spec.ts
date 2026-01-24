import { expect, test } from "@playwright/test";

test.describe("Sign Up", () => {
  test("successfully creates a new account and redirects to home", async ({
    page,
  }) => {
    const uniqueEmail = `test-${Date.now()}@example.com`;

    await page.goto("/sign-up");

    await expect(page.getByRole("heading", { name: "Sign Up" })).toBeVisible();

    await page.getByLabel("Name").fill("Test User");
    await page.getByLabel("Email").fill(uniqueEmail);
    await page.getByLabel("Password").fill("password123");

    await page.getByRole("button", { name: "Sign Up" }).click();

    await expect(page).toHaveURL("/");
    await expect(page.getByText("Home")).toBeVisible();
  });

  test("shows validation error for invalid email", async ({ page }) => {
    await page.goto("/sign-up");

    await page.getByLabel("Name").fill("Test User");
    await page.getByLabel("Email").fill("invalid-email");
    await page.getByLabel("Password").fill("password123");

    await page.getByRole("button", { name: "Sign Up" }).click();

    await expect(
      page.getByText("Please enter a valid email address"),
    ).toBeVisible();
  });

  test("shows validation error for short password", async ({ page }) => {
    await page.goto("/sign-up");

    await page.getByLabel("Name").fill("Test User");
    await page.getByLabel("Email").fill("test@example.com");
    await page.getByLabel("Password").fill("12345");

    await page.getByRole("button", { name: "Sign Up" }).click();

    await expect(
      page.getByText("Password must be at least 6 characters long"),
    ).toBeVisible();
  });

  test("shows validation error for short name", async ({ page }) => {
    await page.goto("/sign-up");

    await page.getByLabel("Name").fill("T");
    await page.getByLabel("Email").fill("test@example.com");
    await page.getByLabel("Password").fill("password123");

    await page.getByRole("button", { name: "Sign Up" }).click();

    await expect(
      page.getByText("Name must be at least 2 characters long"),
    ).toBeVisible();
  });
});

test.describe("Sign In", () => {
  const testUserEmail = `signin-test-${Date.now()}@example.com`;
  const testUserPassword = "password123";
  const testUserName = "Sign In Test User";

  test.beforeAll(async ({ browser }) => {
    const page = await browser.newPage();
    await page.goto("/sign-up");

    await page.getByLabel("Name").fill(testUserName);
    await page.getByLabel("Email").fill(testUserEmail);
    await page.getByLabel("Password").fill(testUserPassword);

    await page.getByRole("button", { name: "Sign Up" }).click();
    await expect(page).toHaveURL("/");
    await page.close();
  });

  test("successfully signs in and redirects to home", async ({ page }) => {
    await page.goto("/sign-in");

    await expect(page.getByRole("heading", { name: "Sign In" })).toBeVisible();

    await page.getByLabel("Email").fill(testUserEmail);
    await page.getByLabel("Password").fill(testUserPassword);

    await page.getByRole("button", { name: "Sign In" }).click();

    await expect(page).toHaveURL("/");
    await expect(page.getByText("Home")).toBeVisible();
  });

  test("shows validation error for invalid email", async ({ page }) => {
    await page.goto("/sign-in");

    await page.getByLabel("Email").fill("invalid-email");
    await page.getByLabel("Password").fill("password123");

    await page.getByRole("button", { name: "Sign In" }).click();

    await expect(
      page.getByText("Please enter a valid email address"),
    ).toBeVisible();
  });

  test("shows validation error for short password", async ({ page }) => {
    await page.goto("/sign-in");

    await page.getByLabel("Email").fill("test@example.com");
    await page.getByLabel("Password").fill("12345");

    await page.getByRole("button", { name: "Sign In" }).click();

    await expect(
      page.getByText("Password must be at least 6 characters long"),
    ).toBeVisible();
  });
});
