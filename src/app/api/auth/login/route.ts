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
                        disabled: false,
                        email: session.jwtPayload.email,
                        flags: session.jwtPayload.userFlags,
                        id: session.jwtPayload.userId,
                        userName: session.jwtPayload.userName,
                    },
                },
                contentType: "application/json",
                jwtPayload: session.jwtPayload,
                status: 200,
            }
        }

        let loginRequestBody: Website.Api.Endpoints.Auth.LoginRequestBody
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
                        httpStatusCode: 400,
                    },
                    {
                        requestBody,
                    },
                )
            }

            loginRequestBody = parseResult.data
        } catch (err) {
            if (err instanceof WebsiteError) {
                throw err
            }

            throw new WebsiteError("request", "Invalid request body received", {
                endpoint: req.url,
                httpStatusCode: 400,
                internalMessage: "Request body not parsable JSON value",
            })
        }

        const { emailOrUsername, password } = loginRequestBody

        const passwordHash = await getPasswordHash(password)

        const user = await client.user.findFirst({
            where: {
                OR: [
                    {
                        email: emailOrUsername,
                    },
                    {
                        userName: emailOrUsername,
                    },
                ],
            },
        })

        if (
            user === null ||
            user.disabled ||
            user.passwordHash !== passwordHash
        ) {
            throw new WebsiteError("request", "Credentials incorrect", {
                endpoint: req.url,
                httpStatusCode: 401,
            })
        }

        return {
            body: {
                success: true,
                data: {
                    disabled: user.disabled,
                    email: user.email,
                    flags: {
                        Admin: user.Flag_Admin,
                        ManageCalendar: user.Flag_ManageCalendar,
                        ManageNews: user.Flag_ManageNews,
                        ManageRooms: user.Flag_ManageRooms,
                        ManageSermons: user.Flag_ManageSermons,
                        ManageUser: user.Flag_ManageUser,
                    },
                    id: user.id,
                    userName: user.userName,
                },
            },
            contentType: "application/json",
            jwtPayload: {
                email: user.email,
                userFlags: {
                    Admin: user.Flag_Admin,
                    ManageCalendar: user.Flag_ManageCalendar,
                    ManageNews: user.Flag_ManageNews,
                    ManageRooms: user.Flag_ManageRooms,
                    ManageSermons: user.Flag_ManageSermons,
                    ManageUser: user.Flag_ManageUser,
                },
                userId: user.id,
                userName: user.userName,
            },
            status: 200,
        }
    },
)
