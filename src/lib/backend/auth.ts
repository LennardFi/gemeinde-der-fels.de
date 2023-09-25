import Website, { Maybe } from "@/typings"
import crypto from "crypto"
import jsonwebtoken from "jsonwebtoken"
import { NextRequest } from "next/server"

export const JWT_Cookie_Name = "JWT-Session"

const key = process.env.GDF_JWT_SIGNING_SECRET ?? ""

export const getJWTForUser = (user: Website.Users.User): string => {
    const payload: Website.Api.JWTPayload = {
        email: user.email,
        flags: user.flags,
        userId: user.id,
        userName: user.userName,
    }

    const jwt = jsonwebtoken.sign(payload, key, {
        expiresIn: "1d",
    })
    return jwt
}

export const validateJWT = async (jwt: string): Promise<Website.Users.User> =>
    new Promise((resolve, reject) => {
        try {
            jsonwebtoken.verify(jwt, key, (err, decoded) => {
                if (err !== null) {
                    return reject(err)
                }

                if (typeof decoded === "string") {
                    return reject("Invalid JWT payload")
                }

                const jwtPayload = decoded as Website.Api.JWTPayload

                return resolve({
                    id: jwtPayload.userId,
                    email: jwtPayload.email,
                    flags: jwtPayload.flags,
                    userName: jwtPayload.userName,
                })
            })
        } catch (error) {
            reject(error)
        }
    })

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
    const jwt = authHeader?.match(/Bearer (.+)/)?.[1]

    return jwt
}
