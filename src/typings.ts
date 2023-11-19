/* eslint-disable @typescript-eslint/no-namespace */
import { ReactNode } from "react"
import { Temporal } from "temporal-polyfill"
import { ErrorScope, WebsiteError } from "./lib/shared/errors"

declare namespace Website {
    namespace Api {
        namespace Endpoints {
            namespace Auth {
                interface LoginRequestBody {
                    emailOrUsername: string
                    password: string
                }

                interface ResetPasswordRequestBodyBase<T extends string> {
                    type: T
                    newPassword: string
                    confirmPassword: string
                }

                interface ResetPasswordWithPasswordRequestBody
                    extends ResetPasswordRequestBodyBase<"password"> {
                    oldPassword: string
                }

                interface ResetPasswordWithTokenRequestBody
                    extends ResetPasswordRequestBodyBase<"token"> {
                    token: string
                }

                type ResetPasswordRequestBody =
                    | ResetPasswordWithPasswordRequestBody
                    | ResetPasswordWithTokenRequestBody
            }

            interface ContactRequestBody {
                name: string
                mail: string
                phone: string
                description: string
            }

            interface SermonsListResponseBodyEntry
                extends Omit<Content.Sermons.Sermon, "date"> {
                date: number
            }

            interface SermonsListResponseBody {
                endOfData: boolean
                entries: SermonsListResponseBodyEntry[]
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

        interface JWTFlags {
            resetPassword?: boolean
        }

        interface JWTPayload {
            email: string
            userFlags: Users.UserFlags
            userId: string
            userName: string
            jwtFlags?: JWTFlags
        }

        interface Cookie {
            name: string
            value: string
            expires?: number
            path?: string
        }

        interface SessionOptionsBase {
            /**
             * The decoded content of the JWT. `undefined` if the JWT wasn't
             * send with the request or failed the validation process.
             */
            jwtPayload?: JWTPayload
            /**
             * The hash of the current set password
             */
            passwordHash?: string
            /**
             * The current state of the user in the database. `undefined` if the
             * JWT wasn't send with the request or failed the validation
             * process.
             */
            user?: Users.User
        }

        type SessionOptions =
            | { jwtPayload: JWTPayload; passwordHash: string; user: Users.User }
            | {
                  jwtPayload?: undefined
                  passwordHash?: undefined
                  user?: undefined
              }
    }

    namespace Base {
        type DeviceSize = "small" | "normal" | "large" | "x-large"
        type Breakpoint = Exclude<DeviceSize, "x-large">

        type SelectOption<L extends string, V extends string> = {
            label: L
            value: V
        }
        type DevFeatureFlags =
            | "admin"
            | "sendEmail"
            | "login"
            | "mediaPlayer"
            | "news"
    }

    namespace UserPreferences {
        interface AudioPreferences {
            muted: boolean
            /**
             * Value between 0 and 1
             */
            volume: number
        }

        interface Preferences {
            audio: AudioPreferences
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
        namespace Audio {
            interface AudioFile {
                fileId: string
                format: string
                id: string
                performer: string
                title: string
                album?: string
            }

            interface Playlist {
                prev: AudioFile[]
                currentlySelected: AudioFile
                next: AudioFile[]
            }

            type RepeatMode = "playlist" | "track" | false
        }

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

            interface FileDetails extends FileMetaData {
                id: string
            }
        }

        namespace Navigation {
            interface NavigationEntry {
                label: ReactNode
                icon?: string
                needsAuth?: boolean
                noLink?: boolean
                onlyMobile?: boolean
                path?: string
                requiresAllDevFeatureFlag?: Base.DevFeatureFlags[]
                requireOneUserFlag?: (keyof Users.UserFlags)[]
                subEntries?: NavigationEntry[]
            }
        }

        namespace Sermons {
            interface SermonsMasterData {}

            interface Sermon {
                audioFileFormat: string
                audioFileId: string
                date: Temporal.PlainDate
                id: string
                title: string
                speaker: Speaker
                series?: Omit<SermonSeries, "parts" | "speakers">
            }

            interface NewSermon
                extends Omit<Sermon, "id" | "speaker" | "series"> {
                speaker: string
                series?: string
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
        type Variant = "text" | "contained" | "outlined"

        type ThemeColor = "primary" | "secondary" | "accent"

        type ThemeColorVariant =
            | "default"
            | "faded"
            | "font-faded"
            | "font-highlighted"
            | "font"
            | "highlighted"

        interface ColorShade {
            default: string
            defaultFont: string
            highlighted: string
            highlightedFont: string
            faded: string
            fadedFont: string
        }

        type Theme = Record<ThemeColor | "background", ColorShade>
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

export type DeepPartial<T> = T extends object
    ? {
          [P in keyof T]?: DeepPartial<T[P]>
      }
    : T

export default Website
