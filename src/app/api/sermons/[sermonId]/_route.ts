// import { buildApiRouteWithDatabase } from "@/lib/backend/apiRouteBuilders"
// import { WebsiteError } from "@/lib/shared/errors"
// import Website from "@/typings"

// export const GET = buildApiRouteWithDatabase<Website.Content.Sermons.Sermon, "sermonId">(
//     async (req, client, session, params) => {
//         if (session.user === undefined) {
//             throw new WebsiteError("request", "User not found", {
//                 endpoint: req.url,
//                 httpStatusCode: 401,
//                 httpStatusText: "User not found",
//             })
//         }

//         const sermon = client.sermon.findUnique({
//             where: {
//                 id: params.sermonId
//             },
//         })

//         return {
//             body: {
//                 success: true,
//                 data: {
//                     id: session.user.id,
//                     flags: session.user.flags,
//                     userName: session.user.userName,
//                     email: session.user.email,
//                 },
//             },
//             contentType: "application/json",
//             jwtPayload: session.jwtPayload,
//             status: 200,
//         }
//     },
// )
