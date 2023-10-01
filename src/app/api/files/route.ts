import { buildApiRouteWithDatabase } from "@/lib/backend/apiRouteBuilders"
import { WebsiteError } from "@/lib/shared/errors"
import { temporalInstanceToDate } from "@/lib/shared/helpers"
import Website from "@/typings"
import mime from "mime"
import path from "path"
import { Temporal } from "temporal-polyfill"

export const POST =
    buildApiRouteWithDatabase<Website.Content.Files.FileMetaData>(
        async (req, client, session) => {
            const { searchParams } = new URL(req.url)
            const fileName = searchParams.get("fileName")

            if (fileName === null) {
                throw new WebsiteError("request", "fileName required", {
                    endpoint: req.url,
                    internalMessage: `URL parameter "fileName" in request required`,
                    statusCode: 400,
                })
            }

            const contentType = req.headers.get("Content-Type")

            if (contentType === null) {
                throw new WebsiteError("request", "Content type required", {
                    endpoint: req.url,
                    internalMessage: `Header "ContentType" in request required`,
                    statusCode: 400,
                })
            }

            const file = await req.blob()
            const arrayBuffers = await Promise.all(
                Array.from<Buffer>({
                    length: Math.ceil(file.size / 16_000_000),
                }).reduce(
                    ({ chunks, position }) => ({
                        chunks: [
                            ...chunks,
                            file
                                .slice(position, position + 16_000_000)
                                .arrayBuffer(),
                        ],
                        position: position + 16_000_000,
                    }),
                    { chunks: [], position: 0 } as {
                        chunks: Promise<ArrayBuffer>[]
                        position: number
                    },
                ).chunks,
            )
            const chunks = arrayBuffers.map((buffer) => Buffer.from(buffer))

            const fileUploadTime = Temporal.Now.zonedDateTimeISO("UTC")

            // client.fileChunk.create({
            //     data: {

            //     }
            // })

            try {
                const newFile = await client.file.create({
                    data: {
                        name: fileName,
                        extension: path.extname(fileName),
                        mimeType: mime.getType(fileName) ?? "",
                        uploadDateTime: temporalInstanceToDate(
                            fileUploadTime,
                            new Date(),
                        ),
                        chunks: {
                            create: chunks.map((chunk) => ({
                                content: chunk,
                            })),
                        },
                    },
                    include: {
                        chunks: true,
                    },
                })

                console.log({ newFile })

                return {
                    body: {
                        success: true,
                        data: {
                            extension: newFile.extension,
                            mimeType: newFile.mimeType,
                            name: newFile.name,
                            uploadDateTime: fileUploadTime.epochMilliseconds,
                        },
                    },
                    jwtPayload: session.jwtPayload,
                    status: 201,
                    statusText: "File created",
                }
            } catch (err) {
                console.log(err)
                throw new WebsiteError(
                    "database",
                    "Database error appeared while storing file",
                    {
                        statusCode: 500,
                    },
                    {
                        err,
                    },
                )
            }
        },
    )
