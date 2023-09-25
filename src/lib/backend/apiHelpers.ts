import Website from "@/typings"

export const isLoginApiRequestBody = (
    value: unknown,
): value is Website.Api.Endpoints.LoginRequestBody => {
    if (typeof value !== "object") {
        return false
    }

    if (value === null) {
        return false
    }

    if (!("email" in value) || !("password" in value)) {
        return false
    }

    if (
        typeof value["email"] !== "string" ||
        typeof value["password"] !== "string"
    ) {
        return false
    }

    return true
}

export const isJWTPayload = (
    value: unknown,
): value is Website.Api.JWTPayload => {
    if (typeof value !== "object" || value === null || Array.isArray(value)) {
        return false
    }

    if (
        !("id" in value) ||
        !("email" in value) ||
        !("userName" in value) ||
        !("flags" in value)
    ) {
        return false
    }

    if (
        typeof value["id"] !== "string" ||
        typeof value["email"] !== "string" ||
        typeof value["userName"] !== "string" ||
        typeof value["flags"] !== "object" ||
        value.flags === null ||
        Array.isArray(value.flags)
    ) {
        return false
    }

    const flags = value.flags as Record<string, unknown>

    if (
        flags["Admin"] !== undefined &&
        flags["Admin"] !== null &&
        typeof flags["Admin"] !== "boolean"
    ) {
        return false
    }

    if (
        flags["ManageCalendar"] !== undefined &&
        flags["ManageCalendar"] !== null &&
        typeof flags["ManageCalendar"] !== "boolean"
    ) {
        return false
    }

    if (
        flags["ManageNews"] !== undefined &&
        flags["ManageNews"] !== null &&
        typeof flags["ManageNews"] !== "boolean"
    ) {
        return false
    }

    if (
        flags["ManageSermons"] !== undefined &&
        flags["ManageSermons"] !== null &&
        typeof flags["ManageSermons"] !== "boolean"
    ) {
        return false
    }

    if (
        flags["ManageRooms"] !== undefined &&
        flags["ManageRooms"] !== null &&
        typeof flags["ManageRooms"] !== "boolean"
    ) {
        return false
    }

    if (
        flags["ManageUser"] !== undefined &&
        flags["ManageUser"] !== null &&
        typeof flags["ManageUser"] !== "boolean"
    ) {
        return false
    }

    return true
}

export const getCookieHeaderValueString = (
    cookie: Website.Api.Cookie,
): string => {
    return `${encodeURIComponent(cookie.name)}=${encodeURIComponent(
        cookie.value,
    )}${
        cookie.expires &&
        `; expires=${new Date(
            new Date().getTime() + cookie.expires * 1000,
        ).toUTCString()}`
    }; path=${cookie.path ?? "/"}`
}
