import { buildApiRouteWithDatabase } from "@/lib/backend/apiRouteBuilders"
import Website from "@/typings"

export const GET =
    buildApiRouteWithDatabase<Website.Api.Endpoints.TestResponseBody>(
        async (req, client, session) => {
            return {
                body: {
                    success: true,
                    data: {
                        client: true,
                        database: true,
                        session: {
                            jwt: session.jwtPayload !== undefined,
                            user: session.user !== undefined,
                        },
                    },
                },
                status: 200,
            }
        },
    )
