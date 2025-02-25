import { test, expect } from "@playwright/test";

test.beforeEach(async ({ page }) => {
  await page.goto("/");
});

const stageComponentsForTest = [
  "IAM User",
  "IAM Group",
  "IAM Role",
  "IAM Managed Policy",
  "EC2 (*)",
  "S3 (*)",
  "RDS (*)",
];

const connectionsForTest = [
  ["IAM User", "IAM Group"],
  ["IAM Managed Policy", "IAM User"],
  ["IAM Managed Policy", "IAM Group"],
  ["IAM Managed Policy", "IAM Role"],
  ["IAM Managed Policy", "EC2 (*)"],
  ["IAM Managed Policy", "S3 (*)"],
  ["IAM Managed Policy", "RDS (*)"],
  ["IAM Role", "EC2 (*)"],
];

test.describe("Canvas Interactions", () => {
  stageComponentsForTest.forEach((stageComponent) => {
    test(`drag stage component (${stageComponent}) from components menu to canvas`, async ({
      page,
    }) => {
      await page.getByTestId("burger").click();
      await page.getByText(stageComponent).dragTo(page.getByTestId("canvas"));
      await expect(page.getByTestId("canvas")).toHaveText(
        new RegExp(stageComponent.replace("(*)", ""))
      );
    });
  });

  connectionsForTest.forEach((connection) => {
    test(`connect two stage components together (${connection[0]} - ${connection[1]})`, async ({
      page,
    }) => {
      await page.getByTestId("burger").click();
      await page.getByText(connection[0]).dragTo(page.getByTestId("canvas"), {
        targetPosition: { x: 30, y: 30 },
      });
      await page.getByText(connection[1]).dragTo(page.getByTestId("canvas"), {
        targetPosition: { x: 200, y: 200 },
      });
      await page
        .getByTestId("canvas")
        .getByText(new RegExp(connection[0]))
        .click({ force: true });
      await page.getByRole("button", { name: "Connect" }).click();
      await expect(() =>
        page
          .getByTestId("canvas")
          .getByText(new RegExp(connection[1].replace("(*)", "")))
          .click({ force: true })
      ).not.toThrow();
    });
  });
});

test.describe("Template Code", () => {
  stageComponentsForTest.forEach((stageComponent) => {
    if (stageComponent.includes("IAM")) {
      test(`add new stage component (${stageComponent})`, async ({ page }) => {
        await page.getByTestId("burger").click();
        await page
          .getByText(stageComponent)
          .dragTo(page.getByTestId("canvas"), {
            targetPosition: { x: 30, y: 30 },
          });
        await page.getByRole("tab", { name: "Template" }).click();
        await expect(page.locator(".monaco-editor")).toHaveText(
          new RegExp(stageComponent.replace("IAM ", "").replace(" ", ""))
        );
      });
    }
  });
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

test.describe("Pull Request Generator", () => {});
test.describe("Commit Generator", () => {});
test.describe("Version History", () => {});
