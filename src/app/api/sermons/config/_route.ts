import { PrismaClient } from "@prisma/client"
import { NextResponse } from "next/server"
import { readSermonsMasterDataFromFilesystem } from "../../../../lib/backend/sermons"

export default async function GET(): Promise<NextResponse> {
    try {
        const client = new PrismaClient()
        await client.$connect()

        const sermons = await readSermonsMasterDataFromFilesystem()

        return await NextResponse.json(sermons, {
            status: 200,
        })
    } catch (e) {
        return new NextResponse(undefined, {
            status: 400,
            statusText: "Could not read sermons master data",
        })
    }
}
