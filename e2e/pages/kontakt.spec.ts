import { expect, test } from "@playwright/test"

test(`Check "Contact" page behavior`, async ({ page }) => {
    // Start from the index page (the baseURL is set via the webServer in the playwright.config.ts)
    await page.goto("/kontakt")

    // Page should have "Kontakt" navigation entry selected
    await expect(page.locator("h1")).toContainText("Kontakt")
})
