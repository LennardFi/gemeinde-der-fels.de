import { buildApiRouteWithDatabase } from "@/lib/backend/apiRouteBuilders"
import { readFileFromFolder } from "@/lib/backend/databaseHelpers"
import { WebsiteError } from "@/lib/shared/errors"

export const GET = buildApiRouteWithDatabase<
    Buffer,
    {
        params: {
            id: number
            fileName: string
        }
    }
>(async (req, client, session, options) => {
    const file = await client.file.findUnique({
        where: {
            id: options.params.id,
        },
    })

    if (file === null) {
        throw new WebsiteError("request", "File not found", {
            httpStatusCode: 404,
            httpStatusText: "File not found",
        })
    }

    const fileContent = await readFileFromFolder(file.fileId, file.extension)

    return {
        body: {
            success: true,
            data: fileContent,
        },
        contentType: file.mimeType,
        headers: {
            "Accept-Ranges": "bytes",
            "Content-Length": fileContent.byteLength.toString(),
            "Content-Disposition": `attachment; filename="${encodeURIComponent(
                options.params.fileName,
            )}"`,
        },
        status: 200,
        jwtPayload: session.jwtPayload,
    }
})
