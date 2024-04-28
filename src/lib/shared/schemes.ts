import { z } from "zod"

export const deviceSizeSchema = z.enum(["tiny", "small", "normal", "large"])

export const userFlagNameSchema = z.enum([
    "Admin",
    "ManageCalendar",
    "ManageNews",
    "ManageRooms",
    "ManageSermons",
    "ManageUser",
])

export const fileRoleSchema = z.enum(["DebugInfo", "SermonAudioFile"])

export const userFlagsSchema = z.object({
    Admin: z.boolean().optional(),
    ManageCalendar: z.boolean().optional(),
    ManageNews: z.boolean().optional(),
    ManageRooms: z.boolean().optional(),
    ManageSermons: z.boolean().optional(),
    ManageUser: z.boolean().optional(),
})

export const userSchema = z.object({
    disabled: z.boolean(),
    email: z.string().email(),
    flags: userFlagsSchema,
    id: z.number().int(),
    userName: z.string(),
})

export const postContactApiRequestBodySchema = z.object({
    description: z.string(),
    name: z.string(),
    mail: z.string().email(),
    phone: z.string(),
    // honeypot entry
    newPassword: z.string().optional(),
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
    audioFileId: z.number().int(),
    date: z.number(),
    series: z.number().int().nullish(),
    speaker: z.number().int(),
    title: z.string(),
})

export const postSermonsSpeakerApiRequestBodySchema = z.object({
    initials: z.string(),
    name: z.string(),
})

export const audioPreferencesSchema = z.object({
    muted: z.boolean().optional(),
    volume: z.number().max(1).min(0).optional(),
})

export const privacyPreferencesSchema = z.object({
    acceptedPrivacyNotesOn: z.number().optional(),
    allowCookies: z.boolean().optional(),
    enabledCookies: z
        .object({
            preferences: z.boolean().optional(),
            session: z.boolean().optional(),
        })
        .optional(),
})

export const preferencesSchema = z.object({
    audio: audioPreferencesSchema.optional(),
    privacy: privacyPreferencesSchema.optional(),
})

export const postDebugApiRequestBodySchema = z.object({
    auth: z.object({
        initialLoadDone: z.boolean(),
        jwtSet: z.boolean(),
        user: userSchema,
    }),
    responsive: z.object({
        deviceSize: deviceSizeSchema,
        height: z.number(),
        width: z.number(),
    }),
    timeStamp: z.number().int(),
    userPreferences: preferencesSchema,
})
