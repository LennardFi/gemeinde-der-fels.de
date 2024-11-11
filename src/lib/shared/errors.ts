import Website from "@/typings"
import { Temporal } from "temporal-polyfill"
import { v4 as uuid } from "uuid"
import { isDevMode } from "./develop"
import { readEnvValueSafely } from "./env"

export type ErrorScope =
    | "api" // REST-API related error
    | "client" // error coming from the frontend
    | "database" // error related to the database
    | "request" // error coming from failed requests
    | "server" // error in the backend code
    | "setup" // error related to the setup like missing env variables or missing database setup. Should be fixed to run the website without any errors.

export type MetaData = Record<string, unknown>

/**
 * `critical`: Critical errors may cause security or privacy issues in the app.
 * This issues should be fixed immediately.
 *
 * `illegalAction`: Illegal actions are a type of error which are caused by
 * invalid states or invalid state transitions in the code of the app. For
 * example an interaction which should be impossible.
 *
 * `error`: Just the default error type. It should be treaded responsible
 * according to the error details.
 *
 * `warning`: A warning about some issues in the app. A warning **must not**
 * intercept the normal result of the user. But it could be hint that there is
 * some wrong or suspicious behavior.
 *
 * @default `"error"`
 */
export type ErrorLevel = "critical" | "illegalAction" | "error" | "warning"

export interface WebsiteErrorOptions {
    databaseConnectionError?: boolean
    httpStatusCode?: number
    httpStatusText?: string
    endpoint?: string
    internalException?: Error
    internalMessage?: string
    /**
     * @default `"error"`
     * @see ErrorLevel
     */
    level?: ErrorLevel
}

export class WebsiteError extends Error {
    public readonly timestamp: Temporal.ZonedDateTime
    public readonly errorId: string
    public readonly scope: ErrorScope
    public readonly message: string
    public readonly options: WebsiteErrorOptions
    public readonly metaData: Readonly<MetaData>

    public constructor(
        scope: ErrorScope,
        message: string,
        options?: WebsiteErrorOptions & {
            stack?: string
        },
        metaData?: MetaData,
    ) {
        const errorId = uuid()
        super(`[${errorId}] ${message}`)

        this.name = "WebsiteError"
        this.timestamp = Temporal.Now.zonedDateTimeISO("UTC")
        this.errorId = errorId
        this.scope = scope
        this.message = message ?? ""
        this.metaData = metaData ?? {}
        if (options?.stack !== undefined) {
            this.stack = options.stack
            options.stack = undefined
        }
        this.options = {
            ...(options?.internalException !== undefined &&
            options.internalException instanceof WebsiteError
                ? options.internalException.options
                : {}),
            ...options,
            level: options?.level ?? "error",
        }
    }

    override toString() {
        return this.toLogOutput()
    }

    public toLogOutput(): string {
        let output = ""

        if (isDevMode && this.stack === undefined) {
            console.warn("Stack in error is missing")
        }

        output += this.errorId
        output += "["
        output += this.scope
        if (this.options.endpoint !== undefined) {
            output += `:${this.options.endpoint}`
        }
        if (this.options.httpStatusCode !== undefined) {
            output += `:${this.options.httpStatusCode}`
        }
        if (this.options.httpStatusText !== undefined) {
            output += `:${this.options.httpStatusText}`
        }
        output += "]"
        output += this.message

        if (this.options.databaseConnectionError) {
            if (this.options.internalMessage !== undefined) {
                output += `\nInternal message:\n>\t${this.options.internalMessage.replaceAll("\n", "\n>\t")}`
            }
            if (
                this.options.internalException !== undefined &&
                this.stack === undefined
            ) {
                output += `\nInternal exception:\n`
                output += `\t[${this.options.internalException.name}] ${this.options.internalException.message}\n`
                output += "\n"
            } else if (this.options.internalException !== undefined) {
                output += `Internal exception:\n`
                output += `\t> ${this.options.internalException.stack?.replaceAll("\n", "\n\t> ")}`
                output += "\n"
            }
        }

        return output
    }

    public toJSON() {
        return {
            errorId: this.errorId,
            scope: this.scope,
            name: this.name,
            message: this.message,
            cause: this.cause,
            stack: this.stack,
            options: this.options,
            metaData: this.metaData,
        }
    }

    public static fromApiError(
        e: Website.Api.ApiError,
        options?: WebsiteErrorOptions,
        metaData?: MetaData,
    ): WebsiteError {
        return new WebsiteError(
            e.scope === "server-internal" ? "server" : e.scope,
            e.message,
            {
                internalMessage: e.internalMessage,
                ...options,
            },
            metaData,
        )
    }

    public log() {
        let logData
        if (readEnvValueSafely("GDF_JSON_LOG", "boolean")) {
            logData = this.toJSON()
        } else {
            logData = this.toLogOutput()
        }

        if (typeof logData !== "string") {
            logData = JSON.stringify(logData, undefined, 2)
        }

        console.error("Error:", logData)
    }
}
