import { buildApiRouteWithDatabase } from "@/lib/backend/apiRouteBuilders"
import { WebsiteError } from "@/lib/shared/errors"
import { temporalInstanceToDate } from "@/lib/shared/helpers"
import { fileRoleSchema, userFlagNameSchema } from "@/lib/shared/schemes"
import {
    fileNameParamName,
    fileRoleParamName,
    requiresUserFlagParamName,
} from "@/lib/shared/urlParams"
import Website, { Maybe } from "@/typings"
import { FileRole, UserFlags } from "@prisma/client"
import mime from "mime"
import path from "path"
import { Temporal } from "temporal-polyfill"

export const dynamic = "force-dynamic"

export const POST =
    buildApiRouteWithDatabase<Website.Content.Files.FileDetails>(
        async (req, client, session) => {
            const { searchParams } = new URL(req.url)
            const fileName = searchParams.get(fileNameParamName)

            if (fileName === null) {
                throw new WebsiteError(
                    "request",
                    `${fileNameParamName} required`,
                    {
                        endpoint: req.url,
                        internalMessage: `URL parameter "${fileNameParamName}" in request required`,
                        httpStatusCode: 400,
                    },
                )
            }

            const contentType = req.headers.get("Content-Type")

            if (contentType === null) {
                throw new WebsiteError("request", "Content type required", {
                    endpoint: req.url,
                    internalMessage: `Header "ContentType" in request required`,
                    httpStatusCode: 400,
                })
            }

            const rawFileRole = searchParams.get(fileRoleParamName) ?? undefined
            let fileRole: Maybe<FileRole>

            if (rawFileRole !== undefined) {
                const result = fileRoleSchema.safeParse(rawFileRole)
                if (!result.success) {
                    throw new WebsiteError(
                        "request",
                        `Invalid ${fileRoleParamName} value`,
                        {
                            endpoint: req.url,
                            internalMessage: `URL parameter "${fileRoleParamName}" contains invalid value`,
                            httpStatusCode: 400,
                        },
                    )
                }
                fileRole = result.data
            }

            const rawRequiresUserFlag =
                searchParams.get(requiresUserFlagParamName) ?? undefined
            let requiresUserFlag: Maybe<keyof Website.Users.UserFlags>

            if (rawRequiresUserFlag !== undefined) {
                const result = userFlagNameSchema.safeParse(rawRequiresUserFlag)
                if (!result.success) {
                    throw new WebsiteError(
                        "request",
                        `Invalid ${requiresUserFlagParamName} value`,
                        {
                            endpoint: req.url,
                            internalMessage: `URL parameter "${requiresUserFlagParamName}" contains invalid value`,
                            httpStatusCode: 400,
                        },
                    )
                }
                requiresUserFlag = result.data
            }

            const fileUploadTime = Temporal.Now.zonedDateTimeISO("UTC")

            try {
                const file = await req.blob()
                const fileBuffer = Buffer.from(await file.arrayBuffer())

                const newFile = await client.file.create({
                    data: {
                        name: fileName,
                        extension: path.extname(fileName),
                        mimeType: mime.getType(fileName) ?? "",
                        uploadDateTime: temporalInstanceToDate(
                            fileUploadTime,
                            new Date(),
                        ),
                        requiresUserFlag:
                            requiresUserFlag === undefined
                                ? undefined
                                : UserFlags[requiresUserFlag],
                        role: fileRole,
                        FileContent: {
                            create: {
                                content: fileBuffer,
                            },
                        },
                    },
                })

                return {
                    body: {
                        success: true,
                        data: {
                            extension: newFile.extension,
                            fileId: newFile.fileId,
                            id: newFile.id,
                            mimeType: newFile.mimeType,
                            name: newFile.name,
                            uploadDateTime: fileUploadTime.epochMilliseconds,
                        },
                    },
                    jwtPayload: session.jwtPayload,
                    status: 201,
                    statusText: "File created",
                }
            } catch (e) {
                throw new WebsiteError(
                    "database",
                    "Database error appeared while storing file",
                    {
                        httpStatusCode: 500,
                        internalException: e instanceof Error ? e : undefined,
                    },
                    {
                        e,
                    },
                )
            }
        },
    )
