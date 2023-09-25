import { buildApiRouteWithDatabase } from "@/lib/backend/apiRouteBuilders"
import { WebsiteError } from "@/lib/errors"
import mime from "mime"
import path from "path"
import { Temporal } from "temporal-polyfill"

export const POST = buildApiRouteWithDatabase<undefined, true>(
    async (req, client, session) => {
        const { searchParams } = new URL(req.url)
        const fileName = searchParams.get("fileName")

        if (fileName === null) {
            throw new WebsiteError("request", "fileName required", {
                endpoint: req.url,
                internalMessage: `URL parameter "fileName" in request required`,
            })
        }

        const contentType = req.headers.get("Content-Type")

        if (contentType === null) {
            throw new WebsiteError("request", "Content type required", {
                endpoint: req.url,
                internalMessage: `Header "ContentType" in request required`,
            })
        }

        const file = await req.blob()
        const chunks = Array.from({
            length: Math.ceil(file.size / 16_000_000),
        }).reduce(
            ({ chunks, position }) => ({
                chunks: [
                    ...chunks,
                    file.slice(position, position + 16_000_000),
                ],
                position: position + 16_000_000,
            }),
            { chunks: [], position: 0 } as { chunks: Blob[]; position: number },
        ).chunks

        await client.file.create({
            data: {
                name: fileName,
                extension: path.extname(fileName),
                mimeType: mime.getType(fileName) ?? "",
                uploadDateTime: Temporal.Now.plainDateTimeISO("UTC").toString(),
                chunks: {
                    create: chunks.map((chunk) => ({
                        content: chunk,
                    })),
                },
            },
        })

        return {
            body: {
                success: true,
                data: true,
            },
            jwt: session.jwt,
            status: 201,
            statusText: "File created",
        }
    },
)
