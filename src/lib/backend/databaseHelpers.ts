import { Maybe } from "@/typings"
import { PrismaClient } from "@prisma/client"
import { WebsiteError } from "../shared/errors"

let _client: Maybe<PrismaClient>
export const getClient = (): PrismaClient => {
    if (_client === undefined) {
        try {
            _client = new PrismaClient()
            _client.$connect()
            console.log("Connected to database client...")
            return _client
        } catch (err) {
            throw new WebsiteError(
                "database",
                "Could not establish a database connection",
                {
                    databaseConnectionError: true,
                    httpStatusCode: 500,
                },
                {
                    err,
                },
            )
        }
    }

    return _client
}

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
