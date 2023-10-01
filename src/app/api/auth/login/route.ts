import { buildApiRouteWithDatabase } from "@/lib/backend/apiRouteBuilders"
import { getPasswordHash } from "@/lib/backend/auth"
import { WebsiteError } from "@/lib/shared/errors"
import { postLoginApiRequestBodySchema } from "@/lib/shared/schemes"
import Website from "@/typings"

export const POST = buildApiRouteWithDatabase<Website.Users.User>(
    async (req, client, session) => {
        if (session.jwtPayload !== undefined) {
            return {
                body: {
                    success: true,
                    data: {
                        email: session.jwtPayload.email,
                        flags: session.jwtPayload.flags,
                        id: session.jwtPayload.userId,
                        userName: session.jwtPayload.userName,
                    },
                },
                jwtPayload: session.jwtPayload,
                status: 200,
            }
        }

        let loginRequestBody: Website.Api.Endpoints.LoginRequestBody
        try {
            const requestBody: unknown = await req.json()
            const parseResult =
                postLoginApiRequestBodySchema.safeParse(requestBody)
            if (!parseResult.success) {
                throw new WebsiteError(
                    "request",
                    "Invalid request body received",
                    {
                        endpoint: req.url,
                        statusCode: 400,
                    },
                    {
                        requestBody,
                    },
                )
            }

            loginRequestBody = parseResult.data
        } catch (err: unknown) {
            if (err instanceof WebsiteError) {
                throw err
            }

            throw new WebsiteError("request", "Invalid request body received", {
                endpoint: req.url,
                statusCode: 400,
                internalMessage: "Request body not parable JSON value",
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
                "E-mail or password not correct",
                {
                    endpoint: req.url,
                    statusCode: 401,
                    statusText: "E-mail or password incorrect",
                },
            )
        }

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
            jwtPayload: {
                email: user.email,
                flags: user.flags,
                userId: user.id,
                userName: user.userName,
            },
            status: 200,
        }
    },
)
