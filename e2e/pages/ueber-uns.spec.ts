import { expect, test } from "@playwright/test"

test(`Check "About Me" page behavior`, async ({ page }) => {
    await page.goto("/ueber-uns")

    await expect(page.locator("h1")).toContainText("Über uns")
})
