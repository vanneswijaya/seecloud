import { test, expect, type Page } from "@playwright/test";

test.beforeEach(async ({ page }) => {
  await page.goto("/");
});

test("drag stage component from components menu to canvas", async ({
  page,
}) => {
  await page.getByTestId("burger").click();
  await page.getByText("IAM User").dragTo(page.getByTestId("canvas"));
});
