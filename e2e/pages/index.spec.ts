import { expect, test } from "@playwright/test"

test(`Check "Index" page behavior`, async ({ page }) => {
    await page.goto("/")

    await expect(page.locator("h1")).toContainText("Wir sindGemeindeder Fels")
})
