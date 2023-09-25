import { isLoginApiRequestBody } from "@/lib/backend/apiHelpers"
import { buildApiRouteWithDatabase } from "@/lib/backend/apiRouteBuilders"
import { getJWTForUser, getPasswordHash } from "@/lib/backend/auth"
import { WebsiteError } from "@/lib/errors"
import Website from "@/typings"

export const POST = buildApiRouteWithDatabase<undefined, Website.Users.User>(
    async (req, client) => {
        let loginRequestBody: Website.Api.Endpoints.LoginRequestBody
        try {
            const requestBody: unknown = await req.json()
            if (!isLoginApiRequestBody(requestBody)) {
                throw requestBody
            }

            loginRequestBody = requestBody
        } catch (err: unknown) {
            throw new WebsiteError("request", "Invalid request body received", {
                endpoint: req.url,
                statusCode: 400,
            })
        }
        const { email, password } = loginRequestBody

        const passwordHash = await getPasswordHash(password)

        const user = await client.user.findUnique({
            where: {
                email,
            },
        })

        if (user === null || user.passwordHash !== passwordHash) {
            throw new WebsiteError(
                "request",
                "Username or password not correct",
                {
                    endpoint: req.url,
                    statusCode: 401,
                    statusText: "E-mail or password incorrect",
                },
            )
        }

        const jwt = getJWTForUser(user)

        return {
            body: {
                success: true,
                data: {
                    id: user.id,
                    flags: user.flags,
                    userName: user.userName,
                    email: user.email,
                },
            },
            jwt,
            status: 200,
        }
    },
)
