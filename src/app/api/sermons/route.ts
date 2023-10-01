import { buildApiRouteWithDatabase } from "@/lib/backend/apiRouteBuilders"
import { WebsiteError } from "@/lib/shared/errors"
import { postSermonsApiRequestBodySchema } from "@/lib/shared/schemes"
import Website from "@/typings"

export const GET = buildApiRouteWithDatabase<Website.Users.User>(
    async (req, _client, session) => {
        if (session.user === undefined) {
            throw new WebsiteError("request", "User not found", {
                endpoint: req.url,
                statusCode: 401,
                statusText: "User not found",
            })
        }

        return {
            body: {
                success: true,
                data: {
                    id: session.user.id,
                    flags: session.user.flags,
                    userName: session.user.userName,
                    email: session.user.email,
                },
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

        const sermon = await client.sermon.create({
            data: {
                date: new Date(parsedResult.data.date),
                audioFile: {
                    connect: {
                        id: parsedResult.data.audioFile,
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
            status: 200,
        }
    },
)
