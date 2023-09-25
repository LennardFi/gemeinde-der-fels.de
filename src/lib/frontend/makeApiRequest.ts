import Website, { Maybe } from "@/typings"
import useAuthZustand from "@/zustand/useAuthZustand"
import { JWT_Cookie_Name } from "../backend/auth"
import { WebsiteError } from "../errors"
import getCookieValue from "./cookies"

interface MakeApiRequestInit extends RequestInit {
    /**
     * contentType Value for the `Content-Header`
     */
    contentType?: string
    /**
     * Skip adding `Authorization` header with JWT value to the request.
     */
    noAuthorization?: boolean
}

interface MakeApiRequestReturn<T> {
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
export default async function makeApiRequest<T>(
    apiEndpoint: `/api/${string}`,
    init?: MakeApiRequestInit,
): Promise<MakeApiRequestReturn<T>> {
    try {
        const currentJWT = useAuthZustand.getState().jwt
        const res = await fetch(apiEndpoint, {
            ...init,
            headers: new Headers({
                ...(init?.contentType !== undefined
                    ? { "Content-Type": init.contentType }
                    : {}),
                ...(init?.noAuthorization && currentJWT !== undefined
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
            console.log("Adding new JWT")
        } else {
            console.log("Adding new JWT")
            newJWT = getCookieValue(JWT_Cookie_Name)
        }

        useAuthZustand.setState({
            jwt: newJWT,
        })

        if (res.headers.get("ContentType") !== "application/json") {
            return {
                jwt: newJWT,
                response: (await res.blob()) as T,
            }
        }

        const body: Website.Api.ApiResponseBody<T> = await res.json()
        if (body.success) {
            return {
                jwt: newJWT,
                response: body.data,
            }
        }

        throw WebsiteError.fromApiError(body.error, {
            statusCode: res.status,
            statusText: res.statusText,
            endpoint: apiEndpoint,
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
