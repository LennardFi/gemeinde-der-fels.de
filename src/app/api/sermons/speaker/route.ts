import { buildApiRouteWithDatabase } from "@/lib/backend/apiRouteBuilders"
import { WebsiteError } from "@/lib/shared/errors"
import { postSermonsSpeakerApiRequestBodySchema } from "@/lib/shared/schemes"

// export const GET = buildApiRouteWithDatabase<Website.Content.Sermons.Sermon[]>(
//     async (req, client, session) => {
//         if (session.user === undefined) {
//             throw new WebsiteError("request", "User not found", {
//                 endpoint: req.url,
//                 statusCode: 401,
//                 statusText: "User not found",
//             })
//         }

//         const sermons = client.sermon.findMany({
//             where: {
//             },
//             cursor: {
//                 id:
//             }
//         })

//         return {
//             body: {
//                 success: true,
//                 data: sermons,
//             },
//             contentType: "application/json",
//             jwtPayload: session.jwtPayload,
//             status: 200,
//         }
//     },
// )

export const POST = buildApiRouteWithDatabase<string>(
    async (req, client, session) => {
        if (session.user === undefined) {
            throw new WebsiteError("request", "Not authenticated", {
                endpoint: req.url,
                httpStatusCode: 401,
            })
        }

        if (!session.user.flags.ManageSermons) {
            throw new WebsiteError(
                "request",
                "The user does not have permission to do this",
                {
                    httpStatusCode: 403,
                },
            )
        }

        let body: unknown
        try {
            body = await req.json()
        } catch (err) {
            throw new WebsiteError("request", "Body not parsable", {
                httpStatusCode: 400,
                httpStatusText: "Body not parsable",
            })
        }

        const parsedResult =
            postSermonsSpeakerApiRequestBodySchema.safeParse(body)

        if (!parsedResult.success) {
            throw new WebsiteError("request", "Invalid request body", {
                httpStatusCode: 400,
                httpStatusText: "Invalid request body",
            })
        }

        const speaker = await client.sermonSpeaker.create({
            data: {
                initials: parsedResult.data.initials,
                name: parsedResult.data.name,
            },
        })

        if (speaker === null) {
            throw new WebsiteError("database", "Failed creating sermons")
        }

        return {
            body: {
                success: true,
                data: speaker.id,
            },
            contentType: "application/json",
            jwtPayload: session.jwtPayload,
            status: 200,
        }
    },
)
