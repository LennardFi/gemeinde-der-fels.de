import Website from "@/typings"
import { Temporal } from "temporal-polyfill"
import { v4 as uuid } from "uuid"

export type ErrorScope = "api" | "client" | "database" | "request" | "server"

export interface WebsiteErrorOptions {
    databaseConnectionError?: boolean
    endpoint?: string
    internalException?: Error
    internalMessage?: string
    statusCode?: number
    statusText?: string
    timestamp?: Temporal.PlainDateTime
}

export class WebsiteError extends Error {
    public readonly errorId: string
    public readonly cause: ErrorScope
    public readonly message: string
    public readonly options: Readonly<WebsiteErrorOptions>
    public static fromApiError(
        e: Website.Api.ApiError,
        options?: WebsiteErrorOptions,
    ): WebsiteError {
        return new WebsiteError(
            e.cause === "server-internal" ? "server" : e.cause,
            e.message,
            {
                ...options,
                internalMessage: e.internalMessage,
            },
        )
    }
    public constructor(
        cause: ErrorScope,
        message: string,
        options?: WebsiteErrorOptions,
    ) {
        super(message, {})

        this.errorId = uuid()
        this.cause = cause
        this.message = message ?? ""
        this.options = {
            ...(options?.internalException !== undefined
                ? options.internalException instanceof WebsiteError
                    ? options.internalException.options
                    : {}
                : {}),
            ...options,
            timestamp:
                options?.timestamp ?? Temporal.Now.plainDateTimeISO("UTC"),
        }
    }

    public toString() {
        return JSON.stringify(null)
    }

    public toLogOutput() {
        return `${this.errorId} [${this.cause}${
            this.options.endpoint === undefined
                ? ""
                : `:${this.options.endpoint}`
        }${
            this.options.statusCode === undefined
                ? ""
                : `:${this.options.statusCode}`
        }${
            this.options.statusText === undefined
                ? ""
                : `:${this.options.statusText}`
        }] ${this.message}`
    }

    public toJSON() {
        return JSON.stringify({
            errorId: this.errorId,
            cause: this.cause,
            message: this.message,
            options: this.options,
        })
    }
}
