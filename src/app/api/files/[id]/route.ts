import { buildApiRouteWithDatabase } from "@/lib/backend/apiRouteBuilders"
import { WebsiteError } from "@/lib/shared/errors"
import { getBooleanSearchParameter } from "@/lib/shared/helpers"
import {
    downloadParamName,
    loginParamName,
    returnToPathParamName,
} from "@/lib/shared/urlParams"
import { redirect } from "next/navigation"

export const dynamic = "force-dynamic"

export const GET = buildApiRouteWithDatabase<Buffer, "id">(
    async (req, client, session, params) => {
        const { searchParams, pathname } = new URL(req.url)
        const parsedFileId = Number.parseInt(params.id)
        if (isNaN(parsedFileId)) {
            throw new WebsiteError(
                "request",
                "File id is not a valid integer",
                {
                    httpStatusCode: 400,
                },
            )
        }

        const file = await client.file.findUnique({
            where: {
                id: parsedFileId,
            },
            include: {
                FileContent: true,
            },
        })

        if (file === null) {
            throw new WebsiteError("request", "File not found", {
                httpStatusCode: 404,
                httpStatusText: "File not found",
            })
        }

        if (
            file.requiresUserFlag !== null &&
            !session.user?.flags[file.requiresUserFlag]
        ) {
            const login = searchParams.get(loginParamName)

            if (login !== null && session.user === undefined) {
                redirect(
                    `/login?${new URLSearchParams({ [returnToPathParamName]: pathname }).toString()}`,
                )
            }

            throw new WebsiteError(
                "request",
                `Requires user flag ${file.requiresUserFlag}`,
                {
                    httpStatusCode: 401,
                },
            )
        }

        const download = getBooleanSearchParameter(
            searchParams,
            downloadParamName,
        )

        return {
            body: {
                success: true,
                data: file.FileContent?.content ?? Buffer.from([]),
            },
            contentType: file.mimeType,
            headers: {
                "Accept-Ranges": "bytes",
                "Content-Length": (
                    file.FileContent?.content?.byteLength ?? 0
                ).toString(),
                "Content-Disposition": `${
                    download ? "attachment" : "inline"
                }; filename="${encodeURIComponent(file.name)}"`,
            },
            status: 200,
            jwtPayload: session.jwtPayload,
        }
    },
)
