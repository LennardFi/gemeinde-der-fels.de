import { buildApiRouteWithDatabase } from "@/lib/backend/apiRouteBuilders"
import { WebsiteError } from "@/lib/shared/errors"
import {
    getBooleanSearchParameter,
    getIntegerSearchParameter,
} from "@/lib/shared/helpers"
import {
    afterIdParamName,
    pageSizeParamName,
    showDisabledParamName,
} from "@/lib/shared/urlParams"
import Website from "@/typings"

export const dynamic = "force-dynamic"

const maxPageSize = 100
const defaultPageSize = 20

export const GET =
    buildApiRouteWithDatabase<Website.Api.Endpoints.UserListResponseBodyEntry>(
        async (req, client, session) => {
            if (session.user === undefined) {
                throw new WebsiteError("request", "Not logged in", {
                    endpoint: req.url,
                    httpStatusCode: 401,
                })
            }

            if (!session.user.flags.ManageUser) {
                throw new WebsiteError(
                    "request",
                    "User not authorized to see user",
                    {
                        endpoint: req.url,
                        httpStatusCode: 403,
                    },
                )
            }

            const { searchParams } = new URL(req.url)
            const afterId = getIntegerSearchParameter(
                searchParams,
                afterIdParamName,
            )

            let pageSize = getIntegerSearchParameter(
                searchParams,
                pageSizeParamName,
                defaultPageSize,
            )

            if (pageSize > maxPageSize) {
                pageSize = maxPageSize
            }

            const showDisabled = getBooleanSearchParameter(
                searchParams,
                showDisabledParamName,
            )

            const users = await client.user.findMany({
                cursor:
                    afterId !== undefined
                        ? {
                              id: afterId,
                          }
                        : undefined,
                orderBy: [
                    {
                        disabled: "asc",
                    },
                    {
                        userName: "asc",
                    },
                ],
                skip: afterId !== undefined ? 1 : 0,
                take: pageSize + 1,
                where: {
                    disabled: !showDisabled ? false : undefined,
                },
            })

            const endOfData = users.length !== pageSize + 1

            return {
                body: {
                    success: true,
                    data: {
                        endOfData,
                        entries: users.map((u) => ({
                            disabled: u.disabled,
                            email: u.email,
                            flags: {
                                Admin: u.Flag_Admin,
                                ManageCalendar: u.Flag_ManageCalendar,
                                ManageNews: u.Flag_ManageNews,
                                ManageRooms: u.Flag_ManageRooms,
                                ManageSermons: u.Flag_ManageSermons,
                                ManageUser: u.Flag_ManageUser,
                            },
                            id: u.id,
                            userName: u.userName,
                        })),
                    },
                },
                contentType: "application/json",
                jwtPayload: session.jwtPayload,
                status: 200,
            }
        },
    )
