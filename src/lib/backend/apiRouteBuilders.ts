import Website, { Maybe } from "@/typings"
import { PrismaClient } from "@prisma/client"
import { NextRequest, NextResponse } from "next/server"
import { getCookieHeaderValueString } from "../shared/apiHelpers"
import { isDevMode } from "../shared/develop"
import { ErrorScope, WebsiteError, WebsiteErrorOptions } from "../shared/errors"
import {
    JWT_Cookie_Name,
    getJWTFromPayload,
    getJWTFromRequest,
    validateJWT,
} from "./auth"
import { getClient } from "./databaseHelpers"
import { logResponseOnServer } from "./logging"

const forbiddenErrorScopes: ErrorScope[] = ["build", "database", "server"]

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
            let sessionOptions: Website.Api.SessionOptions = {}

            if (jwt !== undefined) {
                let jwtPayload: Maybe<Website.Api.JWTPayload>
                try {
                    jwtPayload = await validateJWT(jwt)
                } catch (err) {
                    if (
                        !(err instanceof WebsiteError) ||
                        err.options.httpStatusCode !== 401
                    ) {
                        throw err
                    }
                }

                if (jwtPayload !== undefined) {
                    const user = await getClient().user.findUnique({
                        where: {
                            id: jwtPayload.userId,
                        },
                    })

                    if (user !== null && !user.disabled) {
                        sessionOptions = {
                            jwtPayload: {
                                email: user.email,
                                jwtFlags: jwtPayload.jwtFlags,
                                userFlags: {
                                    Admin: user.AdminFlag,
                                    ManageCalendar: user.ManageCalendarFlag,
                                    ManageNews: user.ManageNewsFlag,
                                    ManageRooms: user.ManageRoomsFlag,
                                    ManageSermons: user.ManageSermonsFlag,
                                    ManageUser: user.ManageUserFlag,
                                },
                                userId: user.id,
                                userName: user.userName,
                            },
                            passwordHash: user.passwordHash,
                            user: {
                                disabled: user.disabled,
                                id: user.id,
                                email: user.email,
                                flags: {
                                    Admin: user.AdminFlag,
                                    ManageCalendar: user.ManageCalendarFlag,
                                    ManageNews: user.ManageNewsFlag,
                                    ManageRooms: user.ManageRoomsFlag,
                                    ManageSermons: user.ManageSermonsFlag,
                                    ManageUser: user.ManageUserFlag,
                                },
                                userName: user.userName,
                            },
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
                                    ? await getJWTFromPayload(
                                          apiResponse.jwtPayload,
                                      )
                                    : "-",
                            expires:
                                apiResponse.jwtPayload !== undefined
                                    ? 60 * 60 * 24 // 24 hours
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
                if (forbiddenErrorScopes.includes(e.scope)) {
                    apiResponse = {
                        body: {
                            success: false,
                            error: {
                                scope: "server-internal",
                                id: e.errorId,
                                message:
                                    "An unexpected error occurred in the server while processing the request. Try again later.",
                            },
                            internalError: e,
                        },
                        contentType: "application/json",
                        cookies: [
                            ...(e.options.httpStatusCode === 401
                                ? [
                                      {
                                          name: JWT_Cookie_Name,
                                          value: "",
                                          expires: -1,
                                      },
                                  ]
                                : []),
                        ],
                        status: e.options.httpStatusCode ?? 500,
                        statusText: e.options.httpStatusText,
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
                            ...(e.options.httpStatusCode === 401
                                ? [
                                      {
                                          name: JWT_Cookie_Name,
                                          value: "",
                                          expires: -1,
                                      },
                                  ]
                                : []),
                        ],
                        status: e.options.httpStatusCode ?? 500,
                        statusText: e.options.httpStatusText,
                    }
                }
            } else {
                const internalError = new WebsiteError(
                    "server",
                    "An error occurred in the server while processing the request.",
                    {
                        endpoint: req.url,
                        internalMessage: `${e}`,
                        internalException: e instanceof Error ? e : undefined,
                    },
                )
                apiResponse = {
                    body: {
                        success: false,
                        error: {
                            scope: "server-internal",
                            id: internalError.errorId,
                            message: internalError.message,
                        },
                        internalError,
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

            const apiResponseBodyWithoutInternalError =
                !isDevMode && !apiResponse.body.success
                    ? {
                          ...apiResponse.body,
                          internalError: undefined,
                      }
                    : apiResponse.body

            return new NextResponse(
                JSON.stringify(apiResponseBodyWithoutInternalError),
                {
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
                },
            )
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
                    logResponseOnServer(apiResponse)
                } catch (error: unknown) {
                    console.log("Failed to log response")
                }
            }
        }
    }
