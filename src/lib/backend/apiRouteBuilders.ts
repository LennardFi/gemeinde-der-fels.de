import Website, { Maybe } from "@/typings"
import { PrismaClient } from "@prisma/client"
import { randomUUID } from "crypto"
import { NextRequest, NextResponse } from "next/server"
import { ErrorScope, WebsiteError, WebsiteErrorOptions } from "../shared/errors"
import { getCookieHeaderValueString } from "./apiHelpers"
import {
    getJWTForPayload,
    getJWTFromRequest,
    JWT_Cookie_Name,
    validateJWT,
} from "./auth"
import { logResponseOnServer } from "./logging"

const forbiddenErrorCauses: ErrorScope[] = ["database"]

let _client: Maybe<PrismaClient>

const getClient = (): PrismaClient => {
    if (_client === undefined) {
        try {
            _client = new PrismaClient()
            _client.$connect()
            console.log("Connecting to database")
            return _client
        } catch (err) {
            throw new WebsiteError(
                "database",
                "Could not establish a database connection",
                {
                    databaseConnectionError: true,
                    statusCode: 500,
                },
                {
                    err,
                },
            )
        }
    }

    return _client
}

/**
 * Builds a NEXT.js route which wraps the database handling away from the given
 * handler.
 *
 * Generics `<T, O>`:
 * - `T`: The success return value of this API route.
 * - `O`: Next.js may provide additional options for a route
 *   (parameters from dynamic routes, etc.).
 *   This options object can be defined with `O`.
 * @param handler The route handler to process the API request with the database
 * client.
 */
export const buildApiRouteWithDatabase =
    <T = unknown, O = undefined>(
        handler: (
            req: NextRequest,
            client: PrismaClient,
            session: Website.Api.SessionOptions,
            options: O,
        ) => Promise<Website.Api.ApiResponse<T>>,
    ): ((req: NextRequest, options: O) => Promise<NextResponse>) =>
    async (req: NextRequest, options: O): Promise<NextResponse> => {
        let apiResponse: Maybe<Website.Api.ApiResponse<T>>
        try {
            const jwt = getJWTFromRequest(req)
            const sessionOptions: Website.Api.SessionOptions = {}

            if (jwt !== undefined) {
                try {
                    sessionOptions.jwtPayload = await validateJWT(jwt)
                } catch (err) {
                    if (
                        !(err instanceof WebsiteError) ||
                        err.options.statusCode !== 401
                    )
                        throw err
                }

                if (sessionOptions.jwtPayload !== undefined) {
                    const user = await getClient().user.findUnique({
                        where: {
                            id: sessionOptions.jwtPayload.userId,
                        },
                    })

                    if (user?.disabled) {
                        sessionOptions.jwtPayload = undefined
                        sessionOptions.user = undefined
                    } else if (user !== null) {
                        sessionOptions.jwtPayload = {
                            email: user.email,
                            flags: user.flags,
                            userId: user.id,
                            userName: user.userName,
                        }
                        sessionOptions.user = {
                            id: user.id,
                            email: user.email,
                            flags: user.flags,
                            userName: user.userName,
                        }
                    }
                }
            }

            apiResponse = await handler(
                req,
                getClient(),
                sessionOptions,
                options,
            )

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
                            value:
                                apiResponse.jwtPayload !== undefined
                                    ? getJWTForPayload(apiResponse.jwtPayload)
                                    : "-",
                            expires:
                                apiResponse.jwtPayload !== undefined
                                    ? 60 * 60 * 12 // 12 hours
                                    : -1,
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
                            ...(apiResponse.contentType === undefined
                                ? {}
                                : {
                                      "Content-Type": apiResponse.contentType,
                                  }),
                            ...apiResponse.headers,
                        }),
                    ),
                },
            )
        } catch (e) {
            if (e instanceof WebsiteError) {
                if (forbiddenErrorCauses.includes(e.scope)) {
                    apiResponse = {
                        body: {
                            success: false,
                            error: {
                                scope: "server-internal",
                                id: e.errorId,
                                message:
                                    "An error occurred in the server while processing the request. Try again later.",
                            },
                            internalError: e,
                        },
                        contentType: "application/json",
                        cookies: [
                            ...(e.options.statusCode === 401
                                ? [
                                      {
                                          name: JWT_Cookie_Name,
                                          value: "",
                                          expires: -1,
                                      },
                                  ]
                                : []),
                        ],
                        status: e.options.statusCode ?? 500,
                        statusText: e.options.statusText,
                    }
                } else {
                    apiResponse = {
                        body: {
                            success: false,
                            error: {
                                scope: e.scope as Website.Api.ApiError["scope"],
                                id: e.errorId,
                                internalMessage: e.options.internalMessage,
                                message: e.message,
                            },
                            internalError: e,
                        },
                        contentType: "application/json",
                        cookies: [
                            ...(e.options.statusCode === 401
                                ? [
                                      {
                                          name: JWT_Cookie_Name,
                                          value: "",
                                          expires: -1,
                                      },
                                  ]
                                : []),
                        ],
                        status: e.options.statusCode ?? 500,
                        statusText: e.options.statusText,
                    }
                }
            } else {
                apiResponse = {
                    body: {
                        success: false,
                        error: {
                            scope: "server-internal",
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
                    contentType: "application/json",
                    status: 500,
                }
            }

            if (
                !apiResponse.body.success &&
                apiResponse.body.internalError !== undefined &&
                apiResponse.body.internalError.options.endpoint === undefined
            ) {
                const options = apiResponse.body.internalError
                    .options as WebsiteErrorOptions
                options.endpoint = req.nextUrl.pathname
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
                        ...(apiResponse.contentType !== undefined
                            ? {
                                  "Content-Type": apiResponse.contentType,
                              }
                            : undefined),
                        ...apiResponse.headers,
                    }),
                ),
            })
        } finally {
            if (
                apiResponse !== undefined &&
                !apiResponse.body.success &&
                (apiResponse.body.internalError !== undefined
                    ? !apiResponse.body.internalError.options
                          .databaseConnectionError
                    : true)
            ) {
                try {
                    logResponseOnServer(apiResponse, _client)
                } catch (error: unknown) {
                    console.log("Failed to log response")
                }
            }
        }
    }
