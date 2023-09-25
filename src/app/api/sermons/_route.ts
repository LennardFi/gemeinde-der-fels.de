import type { NextApiRequest } from "next"
import { NextResponse } from "next/server"
import { readSermonsFromFilesystemWithFilter } from "../../../lib/backend/sermons"
import { isSermonsFilterRequestBody } from "../../../lib/helpers"

export default async function POST(req: NextApiRequest): Promise<NextResponse> {
    if (typeof req.body === "string") {
        try {
            const filter = JSON.parse(req.body) as unknown

            if (isSermonsFilterRequestBody(filter)) {
                return readSermonsFromFilesystemWithFilter(filter)
                    .then((sermons) =>
                        NextResponse.json(sermons, {
                            status: 200,
                        })
                    )
                    .catch(
                        () =>
                            new NextResponse(undefined, {
                                status: 400,
                                statusText: "Could not send mail",
                            })
                    )
            }

            return new NextResponse(undefined, {
                status: 400,
                statusText: "Invalid request body",
            })
        } catch (e: unknown) {
            return new NextResponse(undefined, {
                status: 400,
                statusText: "Could not parse request.",
            })
        }
    }
    return new NextResponse(undefined, {
        status: 400,
    })
}
