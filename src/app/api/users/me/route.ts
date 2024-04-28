import { buildApiRouteWithDatabase } from "@/lib/backend/apiRouteBuilders"
import { WebsiteError } from "@/lib/shared/errors"
import Website from "@/typings"

export const dynamic = "force-dynamic"

export const GET = buildApiRouteWithDatabase<Website.Users.User>(
    async (req, _client, session) => {
        if (session.user === undefined) {
            throw new WebsiteError("request", "User not found", {
                endpoint: req.url,
                httpStatusCode: 401,
                httpStatusText: "User not found",
            })
        }

        return {
            body: {
                success: true,
                data: {
                    disabled: session.user.disabled,
                    email: session.user.email,
                    flags: session.user.flags,
                    id: session.user.id,
                    userName: session.user.userName,
                },
            },
            contentType: "application/json",
            jwtPayload: session.jwtPayload,
            status: 200,
        }
    },
)
