import { test, expect } from "@playwright/test";

test.beforeEach(async ({ page }) => {
  await page.goto("/");
});

test.describe("Access Analyzer", () => {
  test("analyze example user to policy to ec2 access", async ({ page }) => {
    await page.getByTestId("burger").click();
    await page
      .getByText("IAM User")
      .dragTo(page.getByTestId("canvas"), { targetPosition: { x: 30, y: 30 } });
    await page
      .getByText("IAM Managed Policy")
      .dragTo(page.getByTestId("canvas"), {
        targetPosition: { x: 200, y: 200 },
      });
    await page.getByText(/User0/).click({ force: true });
    await page.getByRole("button", { name: "Connect" }).click();
    await page.getByText(/ManagedPolicy1/).click({ force: true });
    await page.getByText("EC2 (*)").dragTo(page.getByTestId("canvas"), {
      targetPosition: { x: 400, y: 400 },
    });
    await page.getByText(/ManagedPolicy1/).click({ force: true });
    await page.getByRole("button", { name: "Connect" }).click();
    await page.getByText(/Generic service/).click({ force: true });

    await page.getByRole("textbox", { name: "Permissions" }).click();
    await page.getByText("ec2:DescribeInstances").click();
    await page.getByRole("button", { name: "Save" }).click();

    await page.getByRole("button", { name: "Action Menu" }).click();
    await page.getByText("Analyze Access").click();

    await page.getByRole("textbox", { name: "Subject" }).click();
    await page.getByRole("option", { name: "User0" }).locator("span").click();
    await page.getByRole("textbox", { name: "Resource" }).click();
    await page.getByRole("option", { name: "EC2 (*)" }).locator("span").click();
    await page.getByRole("textbox", { name: "Action" }).click();
    await page
      .getByRole("option", { name: "ec2:DescribeInstances" })
      .locator("span")
      .click();
    await page.getByRole("button", { name: "Analyze" }).click();

    await expect(page.locator(".mantine-Modal-content")).toHaveText(
      /Prompt returned true/
    );

    await page.getByRole("textbox", { name: "Action" }).click();
    await page
      .getByRole("option", { name: "ec2:RunInstances" })
      .locator("span")
      .click();
    await page.getByRole("button", { name: "Analyze" }).click();

    await expect(page.locator(".mantine-Modal-content")).toHaveText(
      /Prompt returned false/
    );
  });
});
