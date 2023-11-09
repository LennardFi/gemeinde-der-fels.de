import { buildApiRouteWithDatabase } from "@/lib/backend/apiRouteBuilders"
import { WebsiteError } from "@/lib/shared/errors"

export const GET = buildApiRouteWithDatabase<
    Buffer,
    { params: { id: string } }
>(async (req, client, session, options) => {
    const file = await client.file.findUnique({
        where: {
            id: options.params.id,
        },
        include: {
            chunks: true,
        },
    })

    if (file === null) {
        throw new WebsiteError("request", "File not found", {
            httpStatusCode: 404,
            httpStatusText: "File not found",
        })
    }

    const fileContent = Buffer.concat(file.chunks.map((chunk) => chunk.content))

    return {
        body: {
            success: true,
            data: fileContent,
        },
        contentType: file.mimeType,
        headers: {
            "Accept-Ranges": "bytes",
            "Content-Length": fileContent.byteLength.toString(),
        },
        status: 200,
        jwtPayload: session.jwtPayload,
    }
})
