import { buildApiRouteWithDatabase } from "@/lib/backend/apiRouteBuilders"

export const GET = buildApiRouteWithDatabase<
    { params: { id: string } },
    Buffer
>(async (req, client, options) => {
    const file = await client.file.findUnique({
        where: {
            id: options.params.id,
        },
        include: {
            chunks: true,
        },
    })

    const fileContent = Buffer.concat(
        file?.chunks?.map((chunk) => chunk.content) ?? [],
    )

    return {
        body: {
            success: true,
            data: fileContent,
        },
    }
})
