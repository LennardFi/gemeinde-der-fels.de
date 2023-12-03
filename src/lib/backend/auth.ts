import Website, { Maybe } from "@/typings"
import { JWTPayload, jwtVerify, SignJWT } from "jose"
import { NextRequest } from "next/server"
import { WebsiteError } from "../shared/errors"
import { JWTPayloadSchema } from "./schemes"

export const JWT_Cookie_Name = "JWT-Session"

const key = new TextEncoder().encode(process.env.GDF_JWT_SIGNING_SECRET ?? "")

export const getJWTFromPayload = async (
    jwtPayload: Website.Api.JWTPayload,
): Promise<string> => {
    const payload: Website.Api.JWTPayload & JWTPayload = {
        email: jwtPayload.email,
        jwtFlags: jwtPayload.jwtFlags,
        userFlags: jwtPayload.userFlags,
        userId: jwtPayload.userId,
        userName: jwtPayload.userName,
    }

    const jwt = await new SignJWT(payload)
        .setProtectedHeader({
            alg: "HS256",
        })
        .setExpirationTime("1d")
        .sign(key)
    return jwt
}

export const validateJWT = async (
    jwt: string,
): Promise<Website.Api.JWTPayload> => {
    return new Promise((resolve, reject) => {
        try {
            jwtVerify<Website.Api.JWTPayload & JWTPayload>(jwt, key)
                .then((verifyResult) => {
                    const parseResult = JWTPayloadSchema.safeParse(
                        verifyResult.payload,
                    )

                    if (!parseResult.success) {
                        return reject(
                            new WebsiteError(
                                "api",
                                "Invalid JWT payload structure",
                                {
                                    httpStatusCode: 500,
                                    internalException: parseResult.error,
                                },
                                {
                                    errorMsg: parseResult.error.toString(),
                                },
                            ),
                        )
                    }

                    return resolve({
                        email: verifyResult.payload.email,
                        userFlags: verifyResult.payload.userFlags,
                        userId: verifyResult.payload.userId,
                        userName: verifyResult.payload.userName,
                        jwtFlags: verifyResult.payload.jwtFlags,
                    })
                })
                .catch((e) => {
                    return reject(
                        new WebsiteError(
                            "api",
                            "Invalid JWT",
                            {
                                httpStatusCode: 401,
                                internalException:
                                    e instanceof Error ? e : undefined,
                            },
                            {
                                jwt,
                                e,
                            },
                        ),
                    )
                })
        } catch (error) {
            if (error instanceof WebsiteError) {
                reject(error)
                return
            }

            reject(
                new WebsiteError(
                    "api",
                    "Unknown error while validating JWT",
                    {
                        httpStatusCode: 500,
                    },
                    {
                        error,
                        jwt,
                    },
                ),
            )
        }
    })
}

export const refreshJWT = async (
    jwtOrPayload: string | Website.Api.JWTPayload,
): Promise<string> => {
    try {
        const payload =
            typeof jwtOrPayload === "string"
                ? await validateJWT(jwtOrPayload)
                : jwtOrPayload

        return getJWTFromPayload(payload)
    } catch (error) {
        if (error instanceof WebsiteError) {
            throw error
        }
        throw new WebsiteError(
            "api",
            "Unknown error while validating JWT",
            {
                httpStatusCode: 500,
            },
            {
                error,
                jwtOrPayload,
            },
        )
    }
}

// const salt = Buffer.from(process.env.GDF_PASSWORD_SALT ?? "").toString("hex")

export const getPasswordHash = async (password: string): Promise<string> => {
    const msgUint8 = new TextEncoder().encode(password) // encode as (utf-8) Uint8Array
    const hashBuffer = await crypto.subtle.digest("SHA-256", msgUint8) // hash the message
    const hashArray = Array.from(new Uint8Array(hashBuffer)) // convert buffer to byte array
    const hashHex = hashArray
        .map((b) => b.toString(16).padStart(2, "0"))
        .join("") // convert bytes to hex string

    return hashHex
}

export const getAuthHeaderForJWT = (jwt: string) => {
    return {
        Authorization: `Bearer ${jwt}`,
    }
}

export const getJWTFromRequest = (req: NextRequest): Maybe<string> => {
    const authHeader = req.headers.get("Authorization")
    const jwt =
        authHeader?.match(/Bearer (.+)/)?.[1] ??
        req.cookies.get(JWT_Cookie_Name)?.value

    return jwt
}
