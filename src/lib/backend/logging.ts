import Website, { Maybe } from "@/typings"
import { Temporal } from "temporal-polyfill"
import { isDevMode } from "../shared/develop"
import { WebsiteError } from "../shared/errors"
import {
    formatTemporalInstance,
    temporalInstanceToDate,
} from "../shared/helpers"
import { getClient } from "./databaseHelpers"

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
): Promise<void> {
    const client = getClient()
    const timeStamp = Temporal.Now.zonedDateTimeISO("UTC")

    if (
        isDevMode &&
        !res.body.success &&
        res.body.internalError !== undefined
    ) {
        console.debug(
            `Internal error:${formatTemporalInstance(
                timeStamp,
                true,
            )}:${JSON.stringify(
                res.body.internalError,
                undefined,
                2,
            ).replaceAll("\n", "\t\n")}`,
        )
    }

    if (isDevMode) {
        let responseBodyOutput = ""
        if (res.body.success) {
            responseBodyOutput = "/"
        } else {
            responseBodyOutput = JSON.stringify(res.body.error, undefined, 2)
        }
        console.debug(
            `Outgoing response:${formatTemporalInstance(
                timeStamp,
                true,
            )}:${responseBodyOutput.replaceAll("\n", "\t\n")}`,
        )
    }

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
        await client.responseLog.create({
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
    }
}
