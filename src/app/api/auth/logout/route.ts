import { buildApiRouteWithDatabase } from "@/lib/backend/apiRouteBuilders"
import { JWT_Cookie_Name } from "@/lib/backend/auth"
import { WebsiteError } from "@/lib/shared/errors"

export const POST = buildApiRouteWithDatabase<null>(async (req, _, session) => {
    if (session.jwtPayload === undefined) {
        throw new WebsiteError("request", "No JWT send within the request", {
            httpStatusCode: 401,
            httpStatusText: "No JWT given",
            endpoint: req.url,
        })
    }

    return {
        body: {
            success: true,
            data: null,
        },
        contentType: "application/json",
        cookies: [
            {
                name: JWT_Cookie_Name,
                value: "",
                expires: -1,
            },
        ],
        jwtPayload: undefined,
        status: 200,
    }
})
