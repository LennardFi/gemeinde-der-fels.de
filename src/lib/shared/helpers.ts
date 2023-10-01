import { Maybe } from "@/typings"
import { Temporal } from "temporal-polyfill"

export const DIMENSION_BASE = 8
export const SIZE_BREAKPOINT_SMALL = 680
export const SIZE_BREAKPOINT_SMALL_STRING = `${SIZE_BREAKPOINT_SMALL}px`
export const SIZE_BREAKPOINT_NORMAL = 980
export const SIZE_BREAKPOINT_NORMAL_STRING = `${SIZE_BREAKPOINT_NORMAL}px`
export const SIZE_BREAKPOINT_LARGE = 1280
export const SIZE_BREAKPOINT_LARGE_STRING = `${SIZE_BREAKPOINT_LARGE}px`

export function getDimensionValue(
    a: number,
    b: number,
    c: number,
    d: number,
): string
export function getDimensionValue(...values: number[]): string {
    return values.map((x) => `${x * DIMENSION_BASE}px`).join(" ")
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
    try {
        if (temporalInstance instanceof Temporal.PlainDateTime) {
            return new Date(
                temporalInstance.toZonedDateTime("UTC").epochMilliseconds,
            )
        }
        if (temporalInstance instanceof Temporal.ZonedDateTime) {
            return new Date(temporalInstance.epochMilliseconds)
        }
        return fallBack
    } catch (err) {
        console.error(err)
        return fallBack
    }
}
