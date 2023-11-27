import { isDevMode } from "./lib/shared/develop"
import { WebsiteError } from "./lib/shared/errors"

export async function register() {
    try {
        if (isDevMode) {
            if (process.env.NEXT_RUNTIME === "nodejs") {
                const { setupTestEnv } = await import("../test/setupTestEnv")

                const { getClient } = await import(
                    "./lib/backend/databaseHelpers"
                )

                const dbMetadata =
                    await getClient().databaseMetadata.findFirst()

                if (dbMetadata !== null) {
                    if (!dbMetadata.isDevData) {
                        return
                    }

                    if (
                        process.env[
                            "GDF_DEV_DATABASE_REPLACE_EXISTING_DATA"
                        ] !== "1"
                    ) {
                        return
                    }
                }

                setupTestEnv(true)
            }
        }
    } catch (e) {
        if (e instanceof WebsiteError) {
            console.error(e.toLogOutput())
            return
        }

        console.error(
            new WebsiteError(
                "build",
                "Unknown error while running instrumentation hook",
                {
                    internalException: e instanceof Error ? e : undefined,
                    internalMessage: JSON.stringify(e),
                },
            ).toLogOutput(),
        )
    }
}
