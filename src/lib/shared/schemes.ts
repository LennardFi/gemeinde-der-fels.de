import { z } from "zod"

export const postLoginApiRequestBodySchema = z.object({
    email: z.string().email(),
    password: z.string(),
})

export const postSermonsApiRequestBodySchema = z.object({
    audioFileId: z.string(),
    date: z.number(),
    series: z.optional(z.string()),
    speaker: z.string(),
    title: z.string(),
})

export const postSermonsSpeakerApiRequestBodySchema = z.object({
    initials: z.string(),
    name: z.string(),
})
