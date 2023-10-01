import Website, { Maybe } from "@/typings"
import crypto from "crypto"
import jsonwebtoken, { TokenExpiredError } from "jsonwebtoken"
import { NextRequest } from "next/server"
import { WebsiteError } from "../shared/errors"

export const JWT_Cookie_Name = "JWT-Session"

const key = process.env.GDF_JWT_SIGNING_SECRET ?? ""

export const getJWTForPayload = (
    jwtPayload: Website.Api.JWTPayload,
): string => {
    const payload: Website.Api.JWTPayload = {
        email: jwtPayload.email,
        flags: jwtPayload.flags,
        userId: jwtPayload.userId,
        userName: jwtPayload.userName,
    }

    const jwt = jsonwebtoken.sign(payload, key, {
        expiresIn: "1d",
    })
    return jwt
}

export const validateJWT = async (
    jwt: string,
): Promise<Website.Api.JWTPayload> => {
    return new Promise((resolve, reject) => {
        try {
            jsonwebtoken.verify(jwt, key, (err, decoded) => {
                if (err !== null) {
                    if (err instanceof TokenExpiredError) {
                        reject(
                            new WebsiteError(
                                "request",
                                "JWT expired",
                                {
                                    statusCode: 401,
                                    internalException: err,
                                    statusText: "JWT expired",
                                },
                                {
                                    jwt,
                                },
                            ),
                        )
                        return
                    }
                    reject(
                        new WebsiteError(
                            "api",
                            "Invalid JWT",
                            {
                                statusCode: 401,
                                internalException: err,
                            },
                            {
                                jwt,
                            },
                        ),
                    )
                    return
                }

                if (typeof decoded === "string") {
                    reject(
                        new WebsiteError("api", "Invalid JWT payload", {
                            statusCode: 500,
                        }),
                    )
                    return
                }

                const jwtPayload = decoded as Website.Api.JWTPayload

                return resolve(jwtPayload)
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
                        statusCode: 500,
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

        return getJWTForPayload(payload)
    } catch (error) {
        if (error instanceof WebsiteError) throw error
        throw new WebsiteError(
            "api",
            "Unknown error while validating JWT",
            {
                statusCode: 500,
            },
            {
                error,
                jwtOrPayload,
            },
        )
    }
}

const salt = Buffer.from(process.env.GDF_PASSWORD_SALT ?? "").toString("hex")

export const getPasswordHash = async (password: string): Promise<string> => {
    return new Promise((resolve, reject) => {
        return crypto.pbkdf2(
            password,
            salt,
            1000,
            64,
            "sha512",
            (err, passwordHash) => {
                if (err === null) {
                    return resolve(passwordHash.toString("hex"))
                }

                return reject("Error while hashing password")
            },
        )
    })
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
