import { z } from "zod"

export const userFlagsSchema = z.object({
    Admin: z.boolean().nullish(),
    ManageCalendar: z.boolean().nullish(),
    ManageNews: z.boolean().nullish(),
    ManageRooms: z.boolean().nullish(),
    ManageSermons: z.boolean().nullish(),
    ManageUser: z.boolean().nullish(),
})

export const postLoginApiRequestBodySchema = z.object({
    emailOrUsername: z.string(),
    password: z.string(),
})

export const postResetPasswordApiRequestBodySchema = z
    .object({
        type: z.literal("password"),
        oldPassword: z.string(),
        newPassword: z.string(),
        confirmPassword: z.string(),
    })
    .or(
        z.object({
            type: z.literal("token"),
            token: z.string(),
            newPassword: z.string(),
            confirmPassword: z.string(),
        }),
    )

export const postSermonsApiRequestBodySchema = z.object({
    audioFileId: z.string(),
    date: z.number(),
    series: z.string().nullish(),
    speaker: z.string(),
    title: z.string(),
})

export const postSermonsSpeakerApiRequestBodySchema = z.object({
    initials: z.string(),
    name: z.string(),
})

export const audioPreferencesSchema = z.object({
    muted: z.boolean(),
    volume: z.number().max(1).min(0),
})

export const preferencesSchema = z.object({
    audio: audioPreferencesSchema,
})
