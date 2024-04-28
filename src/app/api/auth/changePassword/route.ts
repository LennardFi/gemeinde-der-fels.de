import { buildApiRouteWithDatabase } from "@/lib/backend/apiRouteBuilders"
import {
    getPasswordHash,
    JWT_Cookie_Name,
    validateJWT,
} from "@/lib/backend/auth"
import { WebsiteError } from "@/lib/shared/errors"
import { postResetPasswordApiRequestBodySchema } from "@/lib/shared/schemes"
import Website, { Maybe } from "@/typings"

export const dynamic = "force-dynamic"

export const POST = buildApiRouteWithDatabase<null>(
    async (req, client, session) => {
        let jsonContent: Website.Api.Endpoints.Auth.ResetPasswordRequestBody
        try {
            const requestBody: unknown = await req.json()
            const parseResult =
                postResetPasswordApiRequestBodySchema.safeParse(requestBody)
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

            jsonContent = parseResult.data
        } catch (err: unknown) {
            if (err instanceof WebsiteError) {
                throw err
            }

            throw new WebsiteError("request", "Invalid request body received", {
                endpoint: req.url,
                httpStatusCode: 400,
                internalMessage: "Request body not parsable JSON value",
            })
        }

        const { newPassword, confirmPassword } = jsonContent

        if (newPassword !== confirmPassword) {
            throw new WebsiteError(
                "request",
                "Confirm password not equals new password",
                {
                    httpStatusCode: 400,
                },
            )
        }

        let newPasswordHash: Maybe<string>

        try {
            newPasswordHash = await getPasswordHash(newPassword)
        } catch (e) {
            if (e instanceof WebsiteError) {
                throw e
            }
            throw new WebsiteError(
                "server",
                "Error while hashing new password",
                {
                    internalException: e instanceof Error ? e : undefined,
                    httpStatusCode: 500,
                },
            )
        }

        if (jsonContent.type === "token") {
            const resetJWTPayload = await validateJWT(jsonContent.token)

            if (!resetJWTPayload.jwtFlags?.resetPassword) {
                throw new WebsiteError(
                    "request",
                    "Reset token does not have permission to reset password",
                    {
                        httpStatusCode: 401,
                    },
                )
            }

            await client.user.update({
                data: {
                    passwordHash: newPasswordHash,
                },
                where: {
                    id: resetJWTPayload.userId,
                },
            })

            // TODO: Send mail after change

            return {
                body: {
                    success: true,
                    data: null,
                },
                status: 200,
                contentType: "application/json",
                cookies: [
                    {
                        name: JWT_Cookie_Name,
                        value: "",
                        expires: -1,
                    },
                ],
                jwtPayload: undefined,
            }
        }

        if (session.jwtPayload === undefined) {
            throw new WebsiteError(
                "request",
                "User must be logged in to change the password",
                {
                    httpStatusCode: 401,
                },
            )
        }

        if (jsonContent.oldPassword === undefined) {
            throw new WebsiteError("request", "Old password required", {
                httpStatusCode: 400,
            })
        }

        let oldPasswordHash: Maybe<string>

        try {
            oldPasswordHash = await getPasswordHash(jsonContent.oldPassword)
        } catch (e) {
            if (e instanceof WebsiteError) {
                throw e
            }
            throw new WebsiteError(
                "server",
                "Error while hashing old password",
                {
                    internalException: e instanceof Error ? e : undefined,
                    httpStatusCode: 500,
                },
            )
        }

        if (session.passwordHash !== oldPasswordHash) {
            throw new WebsiteError("request", "Old password not correct", {
                httpStatusCode: 400,
            })
        }

        await client.user.update({
            data: {
                passwordHash: newPasswordHash,
            },
            where: {
                id: session.user.id,
            },
        })

        // TODO: Send mail after change

        return {
            body: {
                success: true,
                data: null,
            },
            status: 200,
            contentType: "application/json",
            jwtPayload: {
                ...session.jwtPayload,
                allowResetPassword: false,
            },
        }
    },
)
