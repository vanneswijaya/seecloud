import { test, expect } from "@playwright/test";

test.beforeEach(async ({ page }) => {
  await page.goto("/");
});

test.describe("Pull Request Generator", () => {
  test("create new pull request", async ({ page }) => {
    await page.getByTestId("burger").click();
    await page.getByText("IAM User").dragTo(page.getByTestId("canvas"), {
      targetPosition: { x: 30, y: 30 },
    });
    await page.getByRole("button", { name: "Action Menu" }).click();
    await page.getByText("Generate pull request").click();

    await page
      .getByRole("textbox", { name: "Pull request title" })
      .fill("[SeeCloud] Playwright PR test " + Date.now().toString());
    await page
      .getByRole("textbox", { name: "Commit message" })
      .fill("Commit from playwright PR test " + Date.now().toString());
    await page.getByRole("tab", { name: "Create new branch" }).click();
    await page
      .getByRole("textbox", { name: "New branch name" })
      .fill("playwright-test-branch-" + Date.now().toString());
    await page.getByRole("textbox", { name: "Base branch" }).click();
    await page.getByRole("option", { name: "main" }).locator("span").click();
    await page.getByRole("button", { name: "Create pull request" }).click();

    await expect(page.locator(".mantine-Modal-content")).toHaveText(
      /Successfully generated pull request/,
      { timeout: 10_000 }
    );
  });
});

test.describe("Commit Generator", () => {
  test("create new commit", async ({ page }) => {
    await page.getByTestId("burger").click();
    await page.getByText("IAM User").dragTo(page.getByTestId("canvas"), {
      targetPosition: { x: 30, y: 30 },
    });
    await page.getByRole("button", { name: "Action Menu" }).click();
    await page.getByText("Create new commit").click();

    await page
      .getByRole("textbox", { name: "Commit message" })
      .fill("Playwright commit test " + Date.now().toString());
    await page.getByRole("textbox", { name: "Branch", exact: true }).click();
    await page
      .getByRole("option", { name: "playwright-test-branch" })
      .locator("span")
      .click();
    await page.getByRole("button", { name: "Commit" }).click();

    await expect(page.locator(".mantine-Modal-content")).toHaveText(
      /Successfully pushed new commit/,
      { timeout: 10_000 }
    );
  });
});

test.describe("Version History", () => {
  test("open version history drawer", async ({ page }) => {
    await page.getByRole("button", { name: "Action Menu" }).click();
    await page.getByText("Version History").click();

    await expect(page.locator(".mantine-Drawer-content")).toHaveText(
      new RegExp("Test PR")
    );
  });

  test("open deployment confirmation modal", async ({ page }) => {
    await page.getByRole("button", { name: "Action Menu" }).click();
    await page.getByText("Version History").click();
    await page.locator(".mantine-ActionIcon-icon").first().click();
    await page.getByText("Deploy to AWS").click();

    await expect(
      page.locator(".mantine-Modal-content").locator(".monaco-editor")
    ).toHaveText(/AWSTemplateFormatVersion/);
  });

  test("open pr github link", async ({ page }) => {
    await page.getByRole("button", { name: "Action Menu" }).click();
    await page.getByText("Version History").click();
    await page.locator(".mantine-ActionIcon-icon").first().click();
    const newTabPromise = page.waitForEvent("popup");

    await page.getByText("Go to GitHub PR").click();
    const newTab = await newTabPromise;
    await newTab.waitForLoadState();

    await expect(newTab).toHaveURL(/github.com/);
  });

  test("restore version to canvas", async ({ page }) => {
    await page.getByRole("button", { name: "Action Menu" }).click();
    await page.getByText("Version History").click();
    await page.locator(".mantine-ActionIcon-icon").first().click();
    await page.getByText("Open in Canvas").click();

    await expect(page.getByTestId("canvas")).toHaveText(/User0/);
  });
});
