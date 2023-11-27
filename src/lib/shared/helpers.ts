import { Maybe } from "@/typings"
import { Temporal } from "temporal-polyfill"
import { WebsiteError } from "./errors"

export const DIMENSION_BASE = 8
export const SIZE_BREAKPOINT_TINY = 680
export const SIZE_BREAKPOINT_TINY_STRING = `${SIZE_BREAKPOINT_TINY}px`
export const SIZE_BREAKPOINT_SMALL = 680
export const SIZE_BREAKPOINT_SMALL_STRING = `${SIZE_BREAKPOINT_SMALL}px`
export const SIZE_BREAKPOINT_NORMAL = 980
export const SIZE_BREAKPOINT_NORMAL_STRING = `${SIZE_BREAKPOINT_NORMAL}px`
export const SIZE_BREAKPOINT_LARGE = 1280
export const SIZE_BREAKPOINT_LARGE_STRING = `${SIZE_BREAKPOINT_LARGE}px`

export function getDimensionValue(
    ...values:
        | [a: number]
        | [a: number, b: number]
        | [a: number, b: number, c: number]
        | [a: number, b: number, c: number, d: number]
): string {
    return values.map((x) => `${x * DIMENSION_BASE}px`).join(" ")
}

export function dateToTemporalInstance(
    date: Date,
    timeZone: string,
): Temporal.ZonedDateTime {
    return Temporal.Instant.fromEpochMilliseconds(
        date.getTime(),
    ).toZonedDateTimeISO(timeZone)
}

export function temporalInstanceToDate(
    temporalInstance: Temporal.PlainDateTime | Temporal.ZonedDateTime,
    fallBack: Date,
): Date
export function temporalInstanceToDate(
    temporalInstance: Temporal.PlainDateTime | Temporal.ZonedDateTime,
): Maybe<Date>
export function temporalInstanceToDate(
    temporalInstance: Temporal.PlainDateTime | Temporal.ZonedDateTime,
    fallBack?: Date,
): Maybe<Date> {
    if (temporalInstance instanceof Temporal.PlainDateTime) {
        return new Date(
            temporalInstance.toZonedDateTime("UTC").epochMilliseconds,
        )
    }
    if (temporalInstance instanceof Temporal.ZonedDateTime) {
        return new Date(temporalInstance.epochMilliseconds)
    }
    return fallBack
}

export function formatTemporalInstance(
    temporalInstance: Temporal.PlainDateTime | Temporal.ZonedDateTime,
): string {
    if (temporalInstance instanceof Temporal.PlainDateTime) {
        return `${temporalInstance.day
            .toString()
            .padStart(2, "0")}:${temporalInstance.month
            .toString()
            .padStart(2, "0")}:${temporalInstance.year
            .toString()
            .padStart(4, "0")}`
    }

    return `${temporalInstance.day
        .toString()
        .padStart(2, "0")}.${temporalInstance.month
        .toString()
        .padStart(2, "0")}.${temporalInstance.year.toString().padStart(4, "0")}`
}

export function formatPlainDate(plainDate: Temporal.PlainDate) {
    return formatTemporalInstance(plainDate.toZonedDateTime("UTC"))
}

export function secondsToTimeStamp(
    timeInSeconds: number,
    keepHours?: boolean | "oneDigit",
    keepMinutes?: boolean,
): string {
    const delimiter = ":"

    const hours = Math.floor(timeInSeconds / 3600)
    const minutes = Math.floor((timeInSeconds - hours * 3600) / 60)
    const seconds = Math.floor(timeInSeconds - hours * 3600 - minutes * 60)

    let timeStamp = ""

    if (hours !== 0 || keepHours) {
        const hoursString = hours.toString()
        timeStamp +=
            (keepHours === "oneDigit"
                ? hoursString
                : hoursString.padStart(2, "0")) + delimiter
    }

    if (timeStamp !== "" || minutes !== 0 || keepMinutes) {
        timeStamp += minutes.toString().padStart(2, "0") + delimiter
    }

    timeStamp += seconds.toString().padStart(2, "0")

    return timeStamp
}

export function getRandomArbitrary(min: number, max: number) {
    return Math.random() * (max - min) + min
}

export function getRandomInt(min: number, max: number) {
    min = Math.ceil(min)
    max = Math.floor(max)
    return Math.floor(Math.random() * (max - min + 1)) + min
}

export function getIntegerSearchParameter(
    searchParams: URLSearchParams,
    key: string,
): number | undefined
export function getIntegerSearchParameter(
    searchParams: URLSearchParams,
    key: string,
    defaultValue: number,
): number
export function getIntegerSearchParameter(
    searchParams: URLSearchParams,
    key: string,
    defaultValue?: number,
): number | undefined {
    const paramValue = searchParams.get(key)

    if (paramValue === null) {
        return defaultValue
    }

    const parsed = Number.parseInt(paramValue)

    if (isNaN(parsed)) {
        throw new WebsiteError(
            "request",
            `Could not parse integer value in "${key}" search parameter`,
            {
                httpStatusCode: 400,
                httpStatusText: `Invalid "${key}" URL parameter`,
            },
        )
    }

    return parsed
}
