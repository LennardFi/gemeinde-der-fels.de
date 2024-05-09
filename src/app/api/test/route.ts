import { buildApiRouteWithDatabase } from "@/lib/backend/apiRouteBuilders"
import { WebsiteError } from "@/lib/shared/errors"
import Website from "@/typings"

export const dynamic = "force-dynamic"

export const revalidate = 300

export const GET =
    buildApiRouteWithDatabase<Website.Api.Endpoints.TestResponseBody>(
        async (_req, client, session) => {
            try {
                const dbMetaData = await client.databaseMetadata.findFirst()

                return {
                    body: {
                        success: true,
                        data: {
                            database: dbMetaData !== undefined,
                            session: {
                                jwt: session.jwtPayload !== undefined,
                                user: session.user !== undefined,
                            },
                        },
                    },
                    status: 200,
                }
            } catch (e) {
                throw new WebsiteError(
                    "server",
                    "Database not available",
                    {
                        databaseConnectionError: true,
                        httpStatusCode: 500,
                        internalException: e instanceof Error ? e : undefined,
                        level: "critical",
                    },
                    {
                        e,
                    },
                )
            }
        },
    )
