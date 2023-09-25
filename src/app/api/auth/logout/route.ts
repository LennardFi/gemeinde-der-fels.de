import { buildApiRouteWithDatabase } from "@/lib/backend/apiRouteBuilders"
import { JWT_Cookie_Name, validateJWT } from "@/lib/backend/auth"
import { WebsiteError } from "@/lib/errors"
import { Maybe } from "@/typings"

export const POST = buildApiRouteWithDatabase<undefined, undefined>(
    async (req) => {
        let jsonWebToken: Maybe<string>
        if (req.headers.has("Authorization")) {
            jsonWebToken = req.headers.get("Authorization") ?? undefined
        } else if (req.cookies.has(JWT_Cookie_Name)) {
            jsonWebToken = req.cookies.get(JWT_Cookie_Name)?.value
        }

        if (jsonWebToken === undefined) {
            throw new WebsiteError(
                "request",
                "No JSON Web Token send within the request",
                {
                    statusCode: 401,
                    statusText: "No JWT given",
                    endpoint: req.url,
                },
            )
        }

        try {
            await validateJWT(jsonWebToken)
        } catch (err: unknown) {
            throw new WebsiteError("request", "Invalid JWT", {
                endpoint: req.url,
                statusCode: 400,
                statusText: "Invalid JWT",
            })
        }

        return {
            body: {
                success: true,
                data: undefined,
            },
            cookies: [
                {
                    name: JWT_Cookie_Name,
                    value: "",
                    expires: -1,
                },
            ],
            status: 200,
        }
    },
)
