import Website, { Maybe } from "@/typings"
import { PrismaClient, ResponseLog } from "@prisma/client"
import { Temporal } from "temporal-polyfill"
import { WebsiteError } from "../errors"

// export async function logErrorOnServer (error: WebsiteError): Promise<void> {
//     const client = new PrismaClient()
//     try {
//         client.$connect();
//     } catch (err: unknown) {

//     }finally {

//     }

// }

export async function logResponseOnServer<T>(
    res: Website.Api.ApiResponse<T>,
    client?: PrismaClient,
): Promise<void> {
    const newClient = new PrismaClient()

    const [responseBody, responseBodyLength, internalError]: [
        Buffer,
        number,
        Maybe<WebsiteError>,
    ] = res.body.success
        ? [
              Buffer.alloc(0),
              Buffer.from(JSON.stringify(res.body.data), "utf8").byteLength,
              undefined,
          ]
        : [
              Buffer.from(JSON.stringify(res.body.error), "utf8"),
              Buffer.from(JSON.stringify(res.body.error), "utf8").byteLength,
              res.body.internalError,
          ]

    const responseLogEntry: Omit<ResponseLog, "id" | "errorLogEntryId"> = {
        timestamp: new Date(Temporal.Now.plainDateTimeISO("UTC").toString()),
        success: res.body.success,
        data: responseBody,
        dataSize: responseBodyLength,
    }

    try {
        if (client === undefined) {
            await newClient.$connect()
        }

        await (client ?? newClient).responseLog.create({
            data: {
                ...responseLogEntry,
                errorLogEntry: {
                    create:
                        internalError === undefined
                            ? undefined
                            : {
                                  cause: internalError.cause,
                                  errorId: internalError.errorId,
                                  message: internalError.message,
                                  timestamp:
                                      internalError.options.timestamp?.toString() ??
                                      new Date(),
                                  internalMessage:
                                      internalError.options.internalMessage,
                              },
                },
                errorLogEntryId: undefined,
            },
        })
    } catch (err: unknown) {
        console.log({
            ...responseLogEntry,
        })
    } finally {
        if (client === undefined) {
            await newClient.$disconnect()
        }
    }
}
