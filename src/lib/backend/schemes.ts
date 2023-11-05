import { z } from "zod"
import { userFlagsSchema } from "../shared/schemes"

// type X = jsonwebtoken.JwtPayload &

export const jwtFlagsSchema = z.object({
    resetPassword: z.boolean().nullish(),
})

export const JWTPayloadSchema = z
    .object({
        email: z.string().email(),
        userFlags: userFlagsSchema,
        userId: z.string(),
        userName: z.string(),
        jwtFlags: jwtFlagsSchema.nullish(),
    })
    .passthrough()
