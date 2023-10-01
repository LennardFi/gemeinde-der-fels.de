import Website from "@/typings"
import { Temporal } from "temporal-polyfill"
import { v4 as uuid } from "uuid"

export type ErrorScope = "api" | "client" | "database" | "request" | "server"

export type MetaData = Record<string, unknown>

export interface WebsiteErrorOptions {
    databaseConnectionError?: boolean
    endpoint?: string
    internalException?: Error
    internalMessage?: string
    statusCode?: number
    statusText?: string
    timestamp?: Temporal.ZonedDateTime
}

export class WebsiteError extends Error {
    public readonly errorId: string
    public readonly scope: ErrorScope
    public readonly message: string
    public readonly options: WebsiteErrorOptions
    public readonly metaData: Readonly<MetaData>
    public static fromApiError(
        e: Website.Api.ApiError,
        options?: WebsiteErrorOptions,
        metaData?: MetaData,
    ): WebsiteError {
        return new WebsiteError(
            e.scope === "server-internal" ? "server" : e.scope,
            e.message,
            {
                ...options,
                internalMessage: e.internalMessage,
            },
            metaData,
        )
    }

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
        return {
            errorId: this.errorId,
            scope: this.scope,
            message: this.message,
            options: this.options,
            metaData: this.metaData,
        }
    }
}
