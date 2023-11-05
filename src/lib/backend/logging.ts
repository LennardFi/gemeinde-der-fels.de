import Website, { Maybe } from "@/typings"
import { PrismaClient } from "@prisma/client"
import { Temporal } from "temporal-polyfill"
import { WebsiteError } from "../shared/errors"
import { temporalInstanceToDate } from "../shared/helpers"

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
    const newClient = client ?? new PrismaClient()
    newClient.$connect()

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

    try {
        const timeStamp = Temporal.Now.zonedDateTimeISO("UTC")
        await newClient.responseLog.create({
            data: {
                data: responseBody,
                dataSize: responseBodyLength,
                status: res.status.toString(),
                statusText: res.statusText,
                success: res.body.success,
                timestamp: temporalInstanceToDate(timeStamp, new Date()),
                errorLogEntry: {
                    create:
                        internalError !== undefined
                            ? {
                                  cause: internalError.scope,
                                  errorId: internalError.errorId,
                                  message: internalError.message,
                                  timestamp: temporalInstanceToDate(
                                      internalError.options.timestamp ??
                                          timeStamp,
                                      new Date(),
                                  ),
                                  internalError: internalError,
                              }
                            : undefined,
                },
            },
            include: {
                errorLogEntry: true,
            },
        })
    } catch (err: unknown) {
        console.log("Failed pushing log to database")
        console.log({ err })
    } finally {
        if (client === undefined) {
            await newClient.$disconnect()
        }
    }
}
