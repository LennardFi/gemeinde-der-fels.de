import { z } from "zod"
import { userFlagsSchema } from "../shared/schemes"

// type X = jsonwebtoken.JwtPayload &

export const jwtFlagsSchema = z.object({
    resetPassword: z.boolean().nullish(),
})

export const JWTPayloadSchema = z
    .object({
        email: z.string().email().or(z.string().length(0)),
        userFlags: userFlagsSchema,
        userId: z.number(),
        userName: z.string(),
        jwtFlags: jwtFlagsSchema.nullish(),
    })
    .passthrough()
