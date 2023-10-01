import { PrismaClient } from "@prisma/client"
import { WebsiteError } from "../shared/errors"

export const withDatabase = async <R = void>(
    handler: (client: PrismaClient) => Promise<R>,
): Promise<R> => {
    const client = new PrismaClient()

    try {
        await client.$connect()
        return await handler(client)
    } catch (e: unknown) {
        if (e instanceof WebsiteError) {
            throw e
        }

        throw new WebsiteError(
            "server",
            "Unknown error while processing server code in the withDatabase helper",
            {
                internalException: e instanceof Error ? e : undefined,
            },
        )
    } finally {
        await client.$disconnect()
    }
}
