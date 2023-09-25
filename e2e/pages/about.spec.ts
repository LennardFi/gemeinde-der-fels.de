import { expect, test } from "@playwright/test"

test(`Check "About Me" page behavior`, async ({ page }) => {
    await page.goto("/about")

    // Page should have "Über mich" navigation entry selected
    await expect(page.locator(".Navigation_currentPage__B_txF")).toContainText(
        "Über mich"
    )
})
