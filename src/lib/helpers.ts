import Website from "../typings"

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

export function isSermonsFilterRequestBody(
    value: unknown,
): value is Website.Api.Endpoints.SermonsFilterRequestBody {
    if (typeof value !== "object") {
        return false
    }

    if (value === null) {
        return false
    }

    if (
        !("speakers" in value) ||
        !Array.isArray((value as Record<string, unknown>).speakers) ||
        (value as Record<"speakers", unknown[]>).speakers.some(
            (s) => typeof s !== "string",
        )
    ) {
        return false
    }

    return true
}

export function isContactRequestBody(
    value: unknown,
): value is Website.Api.Endpoints.ContactRequestBody {
    if (typeof value !== "object") {
        return false
    }

    if (value === null) {
        return false
    }

    if (
        !("name" in value) ||
        typeof (value as Record<string, unknown>).name !== "string"
    ) {
        return false
    }

    if (
        !("mail" in value) ||
        typeof (value as Record<string, unknown>).mail !== "string"
    ) {
        return false
    }

    if (
        !("phone" in value) ||
        typeof (value as Record<string, unknown>).phone !== "string"
    ) {
        return false
    }

    if (
        !("description" in value) ||
        typeof (value as Record<string, unknown>).description !== "string"
    ) {
        return false
    }

    return true
}
