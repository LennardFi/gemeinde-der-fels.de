import Website, { Maybe } from "@/typings"
import useAuthZustand from "@/zustand/useAuthZustand"
import { JWT_Cookie_Name } from "../backend/auth"
import { WebsiteError } from "../shared/errors"
import getCookieValue from "./cookies"

type ResponseType = "arrayBuffer" | "blob" | "json" | "text"

interface MakeApiRequestInit extends RequestInit {
    /**
     * Shortcut to set value of `"Content-Type"`-Header
     */
    contentType?: string
    /**
     * Skip adding `Authorization` header with JWT value to the request.
     */
    noAuthorization?: boolean
}

interface MakeApiRequestJsonReturn<T> {
    /**
     * The new JWT returned from the API. If the API response didn't return a
     * JWT this field is empty. Also important: If the API didn't send a new
     * JWT, the frontend shouldn't use the old one anymore.
     */
    jwt?: string
    /**
     * The parsed / processed response body.
     */
    response: T
}

/**
 * Wraps the browser fetch API with some error and authenticated handling to
 * provide a direct API request function.
 *
 * Generics `<T>`:
 * - `T`: The type of the response body value. Use `Blob` for binary data.
 * @param apiEndpoint URL path of the API endpoint.
 * @param init The request init object used in the fetch API
 * @returns If the API request was successful, this function returns an resolve
 * Promise with the parsed/processed response body. Otherwise it returns an
 * rejected Promise. The reject value may be a WebsiteError instance.
 */
export async function makeApiRequest<T extends ArrayBuffer | Blob>(
    apiEndpoint: `/api/${string}`,
    responseType: "arrayBuffer" | "blob",
    init?: MakeApiRequestInit,
): Promise<MakeApiRequestJsonReturn<T>>
export async function makeApiRequest<T>(
    apiEndpoint: `/api/${string}`,
    responseType: "json",
    init?: MakeApiRequestInit,
): Promise<MakeApiRequestJsonReturn<T>>
export async function makeApiRequest<T extends string>(
    apiEndpoint: `/api/${string}`,
    responseType: "text",
    init?: MakeApiRequestInit,
): Promise<MakeApiRequestJsonReturn<T>>
export async function makeApiRequest<T>(
    apiEndpoint: `/api/${string}`,
    responseType: ResponseType,
    init?: MakeApiRequestInit,
): Promise<MakeApiRequestJsonReturn<T>> {
    try {
        const currentJWT = useAuthZustand.getState().jwt
        const res = await fetch(apiEndpoint, {
            ...init,
            headers: new Headers({
                ...(init?.contentType !== undefined
                    ? { "Content-Type": init.contentType }
                    : {}),
                ...(!init?.noAuthorization && currentJWT !== undefined
                    ? { Authorization: `Bearer ${currentJWT}` }
                    : {}),
                ...init?.headers,
            }),
        })

        const authHeaderValue = res.headers.get("Authorization")
        const match = authHeaderValue?.match("Bearer (.*)")
        let newJWT: Maybe<string> = undefined
        if (match !== null && match !== undefined) {
            newJWT = match[1]
        } else {
            newJWT = getCookieValue(JWT_Cookie_Name)
        }

        useAuthZustand.setState({
            jwt: newJWT,
        })

        if (res.ok) {
            switch (responseType) {
                case "arrayBuffer": {
                    const buffer = await res.arrayBuffer()
                    return {
                        jwt: newJWT,
                        response: buffer as T,
                    }
                }
                case "blob": {
                    const blob = await res.blob()
                    return {
                        jwt: newJWT,
                        response: blob as T,
                    }
                }
                case "json": {
                    const json =
                        (await res.json()) as Website.Api.ApiSuccessResponseBody<T>
                    return {
                        jwt: newJWT,
                        response: json.data,
                    }
                }
                case "text": {
                    const text = await res.text()
                    return {
                        jwt: newJWT,
                        response: text as T,
                    }
                }
            }
        }

        const contentType = res.headers.get("Content-Type")

        if (contentType === "application/json") {
            const body = (await res.json()) as Website.Api.ApiErrorResponseBody
            throw WebsiteError.fromApiError(body.error, {
                endpoint: apiEndpoint,
                httpStatusCode: res.status,
                httpStatusText: res.statusText,
            })
        }

        throw new WebsiteError("api", "Non JSON error message returned.", {
            endpoint: apiEndpoint,
            httpStatusCode: res.status,
            httpStatusText: res.statusText,
        })
    } catch (e: unknown) {
        let err: WebsiteError
        if (e instanceof WebsiteError) {
            err = e
        } else {
            err = new WebsiteError(
                "api",
                "Login failed because of unknown error",
                {
                    endpoint: apiEndpoint,
                    internalException: e instanceof Error ? e : undefined,
                },
            )
        }

        console.error(err.toLogOutput())

        throw err
    }
}

const foo = async () => {
    const x = await makeApiRequest<string>("/api/foo", "json")
}

export async function makeFileApiRequest(
    fileId: string,
    responseType: "arrayBuffer",
): Promise<ArrayBuffer>
export async function makeFileApiRequest(
    fileId: string,
    responseType: "blob",
): Promise<Blob>
export async function makeFileApiRequest<T>(
    fileId: string,
    responseType: "json",
): Promise<Website.Api.ApiSuccessResponseBody<T>>
export async function makeFileApiRequest(
    fileId: string,
    responseType: "text",
): Promise<string>
export async function makeFileApiRequest<T>(
    fileId: string,
    responseType: ResponseType,
): Promise<T> {
    switch (responseType) {
        case "arrayBuffer":
            return (await makeApiRequest<ArrayBuffer>(
                `/api/file/${fileId}`,
                "arrayBuffer",
            )) as unknown as Promise<T>
        case "blob":
            return (await makeApiRequest<Blob>(
                `/api/file/${fileId}`,
                "blob",
            )) as unknown as Promise<T>
        case "json":
            return (await makeApiRequest<T>(
                `/api/file/${fileId}`,
                "json",
            )) as unknown as Promise<T>
        case "text":
            return (await makeApiRequest<string>(
                `/api/file/${fileId}`,
                "text",
            )) as unknown as Promise<T>
    }
}
