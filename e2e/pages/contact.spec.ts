import { expect, test } from "@playwright/test"

test(`Check "Contact" page behavior`, async ({ page }) => {
    // Start from the index page (the baseURL is set via the webServer in the playwright.config.ts)
    await page.goto("/contact")

    // Page should have "Kontakt" navigation entry selected
    await expect(page.locator(".Navigation_currentPage__B_txF")).toContainText(
        "Kontakt"
    )
})
