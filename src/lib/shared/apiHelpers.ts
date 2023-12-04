import Website from "@/typings"

export const defaultListPageSize = 20

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
