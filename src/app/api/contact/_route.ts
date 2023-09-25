// import { withDatabase } from "@/lib/backend/handler"
// import type { NextApiRequest } from "next"
// import { NextResponse } from "next/server"
// import { isContactRequestBody } from "../../../lib/helpers"
// import { sendMail } from "../../../lib/mailing"

// export const POST = withDatabase(async (req, client) => {
//     if (typeof req.body === "string") {
//         try {
//             const v = JSON.parse(req.body) as unknown

//             if (isContactRequestBody(v)) {
//                 return sendMail(v.name, v.mail, v.phone, v.description)
//                     .then(
//                         () =>
//                             new NextResponse(undefined, {
//                                 status: 200,
//                             })
//                     )
//                     .catch(
//                         () =>
//                             new NextResponse(undefined, {
//                                 status: 400,
//                                 statusText: "Could not send mail",
//                             })
//                     )
//             }

//             return new NextResponse(undefined, {
//                 status: 400,
//                 statusText: "Invalid request body",
//             })
//         } catch (e: unknown) {
//             return new NextResponse(undefined, {
//                 status: 400,
//                 statusText: "Could not parse request.",
//             })
//         }
//     }
//     return new NextResponse(undefined, {
//         status: 400,
//     })
// })
