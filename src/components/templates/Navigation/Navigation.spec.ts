import { SIZE_BREAKPOINT_LARGE } from "@/lib/shared/helpers"
import { expect, test } from "@playwright/test"

test.describe(`Component "Navigation"`, async () => {
    try {
        test("Navigation responsive according to viewport width", async ({
            page,
            viewport,
        }) => {
            await page.goto("/")

            if (viewport === null || viewport.width >= SIZE_BREAKPOINT_LARGE) {
                await expect(page.locator("header>nav")).toHaveCSS(
                    "display",
                    "flex",
                )
                await expect(page.locator("header>button")).toHaveCSS(
                    "display",
                    "none",
                )

                return
            }

            await expect(page.locator("header>nav")).toHaveCSS(
                "display",
                "none",
            )
            await expect(page.locator("header>button")).toHaveCSS(
                "display",
                "flex",
            )
        })
    } catch (e) {
        console.log(`${e}`)
        throw e
    }
})
