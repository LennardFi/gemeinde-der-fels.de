import { buildApiRouteWithDatabase } from "@/lib/backend/apiRouteBuilders"
import { WebsiteError } from "@/lib/shared/errors"
import { dateToTemporalInstance } from "@/lib/shared/helpers"
import { postSermonsApiRequestBodySchema } from "@/lib/shared/schemes"
import Website from "@/typings"
import { Temporal } from "temporal-polyfill"

export const GET = buildApiRouteWithDatabase<Website.Content.Sermons.Sermon[]>(
    async (req, client, session) => {
        const sermons = await client.sermon.findMany({
            include: {
                series: true,
                speaker: true,
            },
        })

        return {
            body: {
                success: true,
                data: sermons.map<Website.Content.Sermons.Sermon>((sermon) => ({
                    audioFileId: sermon.audioFileId,
                    date: (
                        dateToTemporalInstance(sermon.date, "UTC") ??
                        Temporal.Instant.fromEpochMilliseconds(
                            1_000_000,
                        ).toZonedDateTimeISO("UTC")
                    ).toPlainDate(),
                    id: sermon.id,
                    title: sermon.title,
                    speaker: {
                        id: sermon.speaker.id,
                        initials: sermon.speaker.initials,
                        name: sermon.speaker.name,
                    },
                    series:
                        sermon.series === null
                            ? undefined
                            : {
                                  id: sermon.series.id,
                                  title: sermon.series.title,
                              },
                })),
            },
            contentType: "application/json",
            jwtPayload: session.jwtPayload,
            status: 200,
        }
    },
)

export const POST = buildApiRouteWithDatabase<string>(
    async (req, client, session) => {
        if (session.user === undefined) {
            throw new WebsiteError("request", "Not authenticated", {
                endpoint: req.url,
                statusCode: 401,
            })
        }

        if (!session.user.flags.ManageSermons) {
            throw new WebsiteError(
                "request",
                "The user does not have permission to do this",
                {
                    statusCode: 403,
                },
            )
        }

        let body: unknown
        try {
            body = await req.json()
        } catch (err) {
            throw new WebsiteError("request", "Body not parsable", {
                statusCode: 400,
                statusText: "Body not parsable",
            })
        }

        const parsedResult = postSermonsApiRequestBodySchema.safeParse(body)

        if (!parsedResult.success) {
            console.log({ error: parsedResult.error })

            throw new WebsiteError("request", "Invalid request body", {
                statusCode: 400,
                statusText: "Invalid request body",
            })
        }

        const series =
            parsedResult.data.series !== undefined
                ? await client.sermonSeries.findUnique({
                      where: {
                          id: parsedResult.data.series,
                      },
                      include: {
                          parts: true,
                      },
                  })
                : null

        const sermonSpeaker = client.sermonSpeaker.findUnique({
            where: {
                id: parsedResult.data.speaker,
            },
        })

        if (sermonSpeaker === null) {
            throw new WebsiteError(
                "request",
                "Speaker does not exist",
                {
                    statusCode: 404,
                    statusText: "Speaker not found",
                },
                {
                    sermonSpeakerId: parsedResult.data.speaker,
                },
            )
        }

        const file = client.file.findUnique({
            where: {
                id: parsedResult.data.audioFileId,
            },
        })

        if (file === null) {
            throw new WebsiteError(
                "request",
                "Audio file does not exist",
                {
                    statusCode: 404,
                    statusText: "Audio file not found",
                },
                {
                    audioFileId: parsedResult.data.audioFileId,
                },
            )
        }

        const sermon = await client.sermon.create({
            data: {
                date: new Date(parsedResult.data.date),
                audioFile: {
                    connect: {
                        id: parsedResult.data.audioFileId,
                    },
                },
                title: parsedResult.data.title,
                series:
                    series !== null
                        ? {
                              connect: {
                                  id: series.id,
                              },
                          }
                        : undefined,
                speaker: {
                    connect: {
                        id: parsedResult.data.speaker,
                    },
                },
            },
        })

        if (sermon === null) {
            throw new WebsiteError("database", "Failed creating sermons")
        }

        return {
            body: {
                success: true,
                data: sermon.id,
            },
            contentType: "application/json",
            jwtPayload: session.jwtPayload,
            status: 201,
        }
    },
)
