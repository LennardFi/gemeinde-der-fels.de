import { z } from "zod"

export const postLoginApiRequestBodySchema = z.object({
    email: z.string().email(),
    password: z.string(),
})

export const postSermonsApiRequestBodySchema = z.object({
    audioFile: z.string(),
    date: z.number(),
    series: z.optional(z.string()),
    speaker: z.string(),
    title: z.string(),
})
