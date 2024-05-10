import { configuredFeatureFlags, isDevMode } from "./lib/shared/develop"
import { readEnvValueSafely } from "./lib/shared/env"
import { WebsiteError } from "./lib/shared/errors"

const DB_DATABASE_VERSION: number = 1

export async function register() {
    if (process.env.NEXT_RUNTIME === "nodejs") {
        try {
            console.log(
                `Configured feature flags:\n${configuredFeatureFlags
                    .map((flag) => `\t- ${flag}`)
                    .join("\n")}`,
            )

            const { getClient } = await import("./lib/backend/databaseHelpers")

            let dbMetadata = await getClient().databaseMetadata.findFirst()
            let databaseInitialized: boolean = false

            if (dbMetadata === null) {
                dbMetadata = await getClient().databaseMetadata.create({
                    data: {
                        version: DB_DATABASE_VERSION,
                        isDevData: isDevMode,
                    },
                })
            } else {
                databaseInitialized = true
            }

            const { setupTestEnv, setupProdEnv } = await import(
                "../test/setupDatabase"
            )

            if (isDevMode) {
                if (
                    !databaseInitialized ||
                    (isDevMode &&
                        readEnvValueSafely(
                            "GDF_DEV_DATABASE_REPLACE_EXISTING_DATA",
                            "boolean",
                        ))
                ) {
                    setupTestEnv(true)
                }
            } else {
                if (!databaseInitialized) {
                    setupProdEnv()
                }
            }
        } catch (e) {
            if (e instanceof WebsiteError) {
                console.error(e.toLogOutput())
                return
            }

            console.error(
                new WebsiteError(
                    "server",
                    "Unknown error while running instrumentation hook",
                    {
                        internalException: e instanceof Error ? e : undefined,
                        internalMessage: JSON.stringify(e),
                    },
                ).toLogOutput(),
            )
        }
    }
}
