import { configuredFeatureFlags, isDevMode } from "./lib/shared/develop"
import { readEnvValueSafely } from "./lib/shared/env"
import { WebsiteError } from "./lib/shared/errors"

const DB_DATABASE_VERSION: number = 1

export const runtime = "nodejs"

export async function register() {
    if (process.env.NEXT_RUNTIME === "nodejs") {
        try {
            console.log(
                `Configured feature flags:\n${configuredFeatureFlags
                    .map((flag) => `\t- ${flag}`)
                    .join("\n")}`,
            )

            const { getClient } = await import("./lib/backend/databaseHelpers")

            const dbClient = await getClient()

            let dbMetadata = await dbClient.databaseMetadata.findFirst()
            let databaseInitialized: boolean = false

            if (dbMetadata === null) {
                dbMetadata = await dbClient.databaseMetadata.create({
                    data: {
                        version: DB_DATABASE_VERSION,
                        isDevData: isDevMode,
                    },
                })
            } else {
                databaseInitialized = true
            }

            const { setupTestEnv, setupProdEnv, resetTables } = await import(
                "../test/setupDatabase"
            )

            if (isDevMode) {
                if (
                    !databaseInitialized ||
                    (dbMetadata.isDevData &&
                        readEnvValueSafely(
                            "GDF_DEV_DATABASE_REPLACE_EXISTING_DATA",
                            "boolean",
                        ))
                ) {
                    await setupTestEnv(true)
                    return
                }

                if (
                    !dbMetadata.isDevData &&
                    readEnvValueSafely(
                        "GDF_PROD_DATABASE_REPLACE_EXISTING_DATA",
                        "boolean",
                    ) &&
                    dbMetadata.prodDataDeleteToken !== null &&
                    dbMetadata.prodDataDeleteToken !== "" &&
                    dbMetadata.prodDataDeleteToken ===
                        readEnvValueSafely(
                            "GDF_PROD_DATABASE_REPLACE_EXISTING_DATA_TOKEN",
                            "string",
                        )
                ) {
                    await setupTestEnv(true)
                    return
                }

                return
            }

            if (!databaseInitialized) {
                await setupProdEnv()
                return
            }

            if (
                dbMetadata.isDevData &&
                readEnvValueSafely(
                    "GDF_DEV_DATABASE_REPLACE_EXISTING_DATA",
                    "boolean",
                )
            ) {
                await resetTables()
                await setupProdEnv()
                return
            }

            if (
                !dbMetadata.isDevData &&
                readEnvValueSafely(
                    "GDF_PROD_DATABASE_REPLACE_EXISTING_DATA",
                    "boolean",
                ) &&
                dbMetadata.prodDataDeleteToken !== null &&
                dbMetadata.prodDataDeleteToken !== "" &&
                dbMetadata.prodDataDeleteToken ===
                    readEnvValueSafely(
                        "GDF_PROD_DATABASE_REPLACE_EXISTING_DATA_TOKEN",
                        "string",
                    )
            ) {
                await setupProdEnv(true)
            }
        } catch (e) {
            if (e instanceof WebsiteError) {
                console.error(e.toLogOutput())
                return
            }

            console.error(e)

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
