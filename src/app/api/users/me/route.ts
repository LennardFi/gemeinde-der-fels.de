import { buildApiRouteWithDatabase } from "@/lib/backend/apiRouteBuilders"
import { WebsiteError } from "@/lib/shared/errors"
import Website from "@/typings"

export const GET = buildApiRouteWithDatabase<Website.Users.User>(
    async (req, _client, session) => {
        if (session.user === undefined) {
            throw new WebsiteError("request", "User not found", {
                endpoint: req.url,
                statusCode: 401,
                statusText: "User not found",
            })
        }

        return {
            body: {
                success: true,
                data: {
                    id: session.user.id,
                    flags: session.user.flags,
                    userName: session.user.userName,
                    email: session.user.email,
                },
            },
            contentType: "application/json",
            jwtPayload: session.jwtPayload,
            status: 200,
        }
    },
)
