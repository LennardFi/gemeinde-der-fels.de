/* eslint-disable @typescript-eslint/no-namespace */
import { Temporal } from "temporal-polyfill"
import { ErrorScope, WebsiteError } from "./lib/shared/errors"

declare namespace Website {
    namespace Api {
        namespace Endpoints {
            interface ContactRequestBody {
                name: string
                mail: string
                phone: string
                description: string
            }

            interface LoginRequestBody {
                email: string
                password: string
            }

            interface SermonsFilterRequestBody {
                speakers?: string[]
            }

            interface TestResponseBody {
                client: boolean
                database: boolean
                session: {
                    jwt: boolean
                    user: boolean
                }
            }
        }

        interface ApiError {
            scope: Exclude<ErrorScope, "database"> | "server-internal"
            id: string
            message: string
            internalMessage?: string
        }

        interface ApiResponseBodyBase<S extends boolean> {
            success: S
        }

        interface ApiSuccessResponseBody<T> extends ApiResponseBodyBase<true> {
            data: T
        }

        interface ApiErrorResponseBody extends ApiResponseBodyBase<false> {
            error: ApiError
            internalError?: WebsiteError
        }

        type ApiResponseBody<T> =
            | ApiSuccessResponseBody<T>
            | ApiErrorResponseBody

        interface ApiResponse<T> {
            body: ApiResponseBody<T>
            status: number
            /**
             * Shortcut to set value of `"Content-Type"`-Header
             */
            contentType?: string
            cookies?: Cookie[]
            headers?: HeadersInit
            jwtPayload?: JWTPayload
            statusText?: string
        }

        interface JWTPayload {
            flags: Users.UserFlags
            email: string
            userId: string
            userName: string
        }

        interface Cookie {
            name: string
            value: string
            expires?: number
            path?: string
        }

        interface SessionOptions {
            /**
             * The decoded content of the JWT. `undefined` if the JWT wasn't
             * send with the request or failed the validation process.
             */
            jwtPayload?: JWTPayload
            /**
             * The current state of the user in the database. `undefined` if the
             * JWT wasn't send with the request or failed the validation
             * process.
             */
            user?: Users.User
        }
    }

    namespace Base {
        type DeviceSize = "small" | "normal" | "large" | "x-large"
        type Breakpoint = Exclude<DeviceSize, "x-large">

        type SelectOption<L extends string, V extends string> = {
            label: L
            value: V
        }
    }

    namespace Config {
        interface MailingConfig {
            host: string
            port: number
            user: string
            password: string
            toMailAddress: string
            fromMailAddress: string
            /**
             * Add development hint in e-mail
             */
            dev?: boolean
        }
    }

    namespace Content {
        namespace Files {
            interface FileMetaData {
                name: string
                extension: string
                mimeType: string
                /**
                 * Upload time in epoch seconds
                 */
                uploadDateTime: number
            }
        }

        namespace Navigation {
            interface NavigationEntry {
                label: string
                icon?: string
                needsAuth?: boolean
                noLink?: boolean
                onlyMobile?: boolean
                path?: string
                requiresFlag?: (keyof Users.UserFlags)[]
                subEntries?: NavigationEntry[]
            }
        }

        namespace Sermons {
            interface Sermon {
                audioFile: string
                date: Temporal.PlainDate
                id: string
                title: string
                speaker: Speaker
                series?: SermonSeries
            }

            interface NewSermon
                extends Omit<Sermon, "date" | "id" | "speaker"> {
                date: Temporal.PlainDate
                speaker: Speaker | NewSpeaker
                series?: SermonSeries
            }

            interface SermonsFilter {
                fullText?: string
                seriesId?: string
                speaker?: Speaker[]
            }

            interface Speaker {
                id: string
                initials: string
                name: string
            }

            type NewSpeaker = Omit<Speaker, "id">

            interface SermonSeries {
                id: string
                parts: Sermon[]
                title: string
                speakers: Speaker[]
            }

            type NewSermonSeries = Omit<
                SermonSeries,
                "id" | "parts" | "speakers"
            >
        }

        interface NewsPost {
            description: string
            id: string
            publicationDate: Temporal.PlainDate
            title: string
        }
    }

    namespace Design {
        type InputVariant = "text" | "contained" | "outlined"
    }

    namespace Users {
        interface UserFlags {
            // Can promote users to admins
            Admin?: boolean | null
            // Can change calendar
            ManageCalendar?: boolean | null
            // Can change news
            ManageNews?: boolean | null
            // Can change sermons
            ManageSermons?: boolean | null
            // Can change rooms
            ManageRooms?: boolean | null
            // Can create users
            ManageUser?: boolean | null
        }

        interface User {
            id: string
            email: string
            userName: string
            flags: UserFlags
        }
    }
}

export type Maybe<T> = T | undefined

export default Website
