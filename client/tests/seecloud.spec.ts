import { test, expect, type Page } from "@playwright/test";

test.beforeEach(async ({ page }) => {
  await page.goto("/");
});

test.describe("Canvas Interactions", () => {
  test("drag stage component from components menu to canvas", async ({
    page,
  }) => {
    await page.getByTestId("burger").click();
    await page.getByText("IAM User").dragTo(page.getByTestId("canvas"));
    await expect(page.getByTestId("canvas")).toHaveText(
      "DetailsDeleteConnectIAM UserUser0"
    );
  });

  test("connect two stage components together", async ({ page }) => {
    await page.getByTestId("burger").click();
    await page.getByText("IAM User").dragTo(page.getByTestId("canvas"));
    await expect(page.getByTestId("canvas")).toHaveText(
      "DetailsDeleteConnectIAM UserUser0"
    );
  });
});

test.describe("Template Code", () => {});
test.describe("Pull Request Generator", () => {});
test.describe("Commit Generator", () => {});
test.describe("Version History", () => {});
test.describe("Access Analyzer", () => {});
