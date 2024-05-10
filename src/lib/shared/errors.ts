import Website from "@/typings"
import { Temporal } from "temporal-polyfill"
import { v4 as uuid } from "uuid"

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
    timestamp?: Temporal.ZonedDateTime
}

export class WebsiteError extends Error {
    public readonly errorId: string
    public readonly scope: ErrorScope
    public readonly message: string
    public readonly options: WebsiteErrorOptions
    public readonly metaData: Readonly<MetaData>

    public constructor(
        scope: ErrorScope,
        message: string,
        options?: WebsiteErrorOptions,
        metaData?: MetaData,
    ) {
        super(message, {})

        this.errorId = uuid()
        this.scope = scope
        this.message = message ?? ""
        this.metaData = metaData ?? {}
        this.options = {
            ...(options?.internalException !== undefined
                ? options.internalException instanceof WebsiteError
                    ? options.internalException.options
                    : {}
                : {}),
            ...options,
            level: options?.level ?? "error",
            timestamp:
                options?.timestamp ?? Temporal.Now.zonedDateTimeISO("UTC"),
        }
    }

    public toString() {
        return JSON.stringify(null)
    }

    public toLogOutput() {
        return `${this.errorId} [${this.scope}${
            this.options.endpoint === undefined
                ? ""
                : `:${this.options.endpoint}`
        }${
            this.options.httpStatusCode === undefined
                ? ""
                : `:${this.options.httpStatusCode}`
        }${
            this.options.httpStatusText === undefined
                ? ""
                : `:${this.options.httpStatusText}`
        }] ${this.message}`
    }

    public toJSON() {
        return {
            errorId: this.errorId,
            scope: this.scope,
            message: this.message,
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
}
