import { expect, test } from "@playwright/test"

test(`Check "Index" page behavior`, async ({ page }) => {
    await page.goto("/")

    // Page should have "Portfolio" navigation entry selected
    await expect(page.locator(".Navigation_currentPage__B_txF")).toContainText(
        "Portfolio"
    )
})
