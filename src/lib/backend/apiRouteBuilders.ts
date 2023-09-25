import Website, { Maybe } from "@/typings"
import { PrismaClient } from "@prisma/client"
import { randomUUID } from "crypto"
import { NextRequest, NextResponse } from "next/server"
import { ErrorScope, WebsiteError } from "../errors"
import { getCookieHeaderValueString } from "./apiHelpers"
import { getJWTFromRequest, JWT_Cookie_Name, validateJWT } from "./auth"
import { logResponseOnServer } from "./logging"

const forbiddenErrorCauses: ErrorScope[] = ["database"]

/**
 * Builds a NEXT.js route which wraps the database handling away from the given
 * handler.
 *
 * Generics `<O, T>`:
 * - `O`: Next.js may provide additional options for a route
 *   (parameters from dynamic routes, etc.).
 *   This options object can be defined with `O`.
 * - `T`: The success return value of this API route.
 * @param handler The route handler to process the API request with the database
 * client.
 */
export const buildApiRouteWithDatabase =
    <O = undefined, T = unknown>(
        handler: (
            req: NextRequest,
            client: PrismaClient,
            session: Website.Api.SessionOptions,
            options: O,
        ) => Promise<Website.Api.ApiResponse<T>>,
    ): ((req: NextRequest, options: O) => Promise<NextResponse>) =>
    async (req: NextRequest, options: O): Promise<NextResponse> => {
        const client = new PrismaClient()

        let apiResponse: Maybe<Website.Api.ApiResponse<T>>
        try {
            await client.$connect()

            const jwt = getJWTFromRequest(req)
            const sessionOptions: Website.Api.SessionOptions = {
                jwt,
            }

            if (jwt !== undefined) {
                const user = await client.user.findUnique({
                    where: {
                        id: (await validateJWT(jwt)).id,
                    },
                })

                if (user !== null) {
                    sessionOptions.user = {
                        id: user.id,
                        email: user.email,
                        flags: user.flags,
                        userName: user.userName,
                    }
                }
            }

            apiResponse = await handler(req, client, sessionOptions, options)

            return new NextResponse(
                apiResponse.body.success &&
                Buffer.isBuffer(apiResponse.body.data)
                    ? apiResponse.body.data
                    : JSON.stringify(apiResponse.body),
                {
                    status: apiResponse.status,
                    statusText: apiResponse.statusText,
                    headers: [
                        {
                            name: JWT_Cookie_Name,
                            value: apiResponse.jwt ?? "-",
                            expires:
                                apiResponse.jwt === undefined
                                    ? -1
                                    : 60 * 60 * 12, // 12 hours
                        },
                        ...(apiResponse.cookies ?? []),
                    ].reduce(
                        (headers, cookie) => {
                            headers.append(
                                "Set-Cookie",
                                getCookieHeaderValueString(cookie),
                            )
                            return headers
                        },
                        new Headers({
                            ...apiResponse.headers,
                        }),
                    ),
                },
            )
        } catch (e) {
            if (e instanceof WebsiteError) {
                if (forbiddenErrorCauses.includes(e.cause)) {
                    apiResponse = {
                        body: {
                            success: false,
                            error: {
                                cause: "server-internal",
                                id: e.errorId,
                                message:
                                    "An error occurred in the server while processing the request. Try again later.",
                            },
                            internalError: e,
                        },
                        status: e.options.statusCode ?? 500,
                        statusText: e.options.statusText,
                    }
                } else {
                    apiResponse = {
                        body: {
                            success: false,
                            error: {
                                cause: e.cause as Website.Api.ApiError["cause"],
                                id: e.errorId,
                                internalMessage: e.options.internalMessage,
                                message: e.message,
                            },
                            internalError: e,
                        },
                        status: e.options.statusCode ?? 500,
                        statusText: e.options.statusText,
                    }
                }
            } else {
                apiResponse = {
                    body: {
                        success: false,
                        error: {
                            cause: "server-internal",
                            id: randomUUID(),
                            message:
                                "An error occurred in the server while processing the request. Try again later.",
                        },
                        internalError: new WebsiteError(
                            "api",
                            "An error occurred in the server while processing the request.",
                            {
                                endpoint: req.url,
                                internalMessage: JSON.stringify(e),
                                internalException:
                                    e instanceof Error ? e : undefined,
                            },
                        ),
                    },
                    status: 500,
                }
            }

            return new NextResponse(JSON.stringify(apiResponse.body), {
                status: apiResponse.status ?? 500,
                statusText: apiResponse.statusText,
                headers: (apiResponse.cookies ?? []).reduce(
                    (headers, cookie) => {
                        headers.append(
                            "Set-Cookie",
                            getCookieHeaderValueString(cookie),
                        )
                        return headers
                    },
                    new Headers({
                        ...apiResponse.headers,
                    }),
                ),
            })
        } finally {
            if (
                apiResponse?.body.success === false &&
                (apiResponse.body.internalError instanceof WebsiteError
                    ? !apiResponse?.body.internalError.options
                          .databaseConnectionError
                    : true)
            ) {
                if (apiResponse !== undefined) {
                    try {
                        logResponseOnServer(apiResponse)
                    } catch (error: unknown) {
                        console.log("Failed to log response")
                    }
                }
            }
            await client.$disconnect()
        }
    }
