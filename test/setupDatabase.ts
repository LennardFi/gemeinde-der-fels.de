import { asyncSleep } from "@/lib/shared/develop"
import { readRequiredEnvValueSafely } from "@/lib/shared/env"
import { getRandomInt } from "@/lib/shared/helpers"
import { resetPasswordTokenParamName } from "@/lib/shared/urlParams"
import { readFile } from "fs/promises"
import { join } from "path"
import { cwd } from "process"
import { getJWTFromPayload, getPasswordHash } from "../src/lib/backend/auth"
import { databaseVersion, getClient } from "../src/lib/backend/databaseHelpers"
import { sermons } from "./sermons"
import { users } from "./users"

export async function resetTables() {
    try {
        console.log("Resetting database tables")
        const dbClient = await getClient()

        await dbClient.$transaction([
            dbClient.responseLog.deleteMany(),
            dbClient.errorLog.deleteMany(),
            dbClient.newsPost.deleteMany(),
            dbClient.sermonSeries.deleteMany(),
            dbClient.sermon.deleteMany(),
            dbClient.sermonSpeaker.deleteMany(),
            dbClient.fileContent.deleteMany(),
            dbClient.file.deleteMany(),
            dbClient.user.deleteMany(),
            dbClient.databaseMetadata.deleteMany(),
        ])
        // await rm(filesFolderPath, {
        //     force: true,
        //     recursive: true,
        // })
    } catch (e) {
        console.log("Error occurred while resetting database", e)
        throw e
    }
}

export async function setupTestEnvUsers() {
    const dbClient = await getClient()
    await dbClient.user.deleteMany()
    await dbClient.$transaction(
        async (transaction) => {
            for await (const user of users) {
                console.log(`Creating user "${user.name}"`)

                const passwordHash = await getPasswordHash(user.password)
                await transaction.user.create({
                    data: {
                        userName: user.name,
                        passwordHash,
                        email: `${user.name}@example.com`,
                        Flag_Admin: user.flags.Admin,
                        Flag_ManageCalendar: user.flags.ManageCalendar,
                        Flag_ManageNews: user.flags.ManageNews,
                        Flag_ManageRooms: user.flags.ManageRooms,
                        Flag_ManageSermons: user.flags.ManageSermons,
                        Flag_ManageUser: user.flags.ManageUser,
                    },
                })
            }
        },
        {
            isolationLevel: "Serializable",
            timeout: 10_000,
        },
    )
}

export async function setupProdEnvUsers() {
    const dbClient = await getClient()
    const adminUserName = "admin"

    console.log(`Creating user "${adminUserName}"`)

    const user = await dbClient.user.upsert({
        create: {
            email: "",
            userName: adminUserName,
            passwordHash: "",
            resetPasswordRequired: true,
            Flag_Admin: true,
            Flag_ManageSermons: true,
            Flag_ManageUser: true,
        },
        update: {},
        where: {
            userName: "admin",
            Flag_Admin: true,
        },
    })

    const jwt = await getJWTFromPayload({
        email: user.email,
        userFlags: {
            Admin: true,
            ManageCalendar: false,
            ManageNews: false,
            ManageRooms: false,
            ManageSermons: false,
            ManageUser: false,
        },
        userId: user.id,
        userName: user.userName,
        jwtFlags: {
            resetPassword: true,
        },
    })

    const hostname = readRequiredEnvValueSafely("GDF_WEB_HOSTNAME", "string")
    const port = readRequiredEnvValueSafely("GDF_WEB_EXPOSE_PORT", "string")

    console.log(
        `To create the initial admin account visit this page: http://${hostname}:${port}/change-password?${resetPasswordTokenParamName}=${encodeURIComponent(jwt)}`,
    )
}

const sermonCopies = 10

export async function setupTestEnvSermons() {
    for await (const sermon of sermons) {
        const millisecondsInADay = 1000 * 60 * 60 * 24
        const date = new Date(
            Date.now() - millisecondsInADay * getRandomInt(365, 365 * 3),
        )
        for (let copyIndex = 0; copyIndex < sermonCopies; copyIndex++) {
            const dbClient = await getClient()
            await dbClient.$transaction(
                async (tx) => {
                    const s = {
                        ...sermon,
                        title: `${sermon.title} - Teil ${copyIndex + 1}`,
                    }

                    console.log(
                        `Working on sermon "${s.speaker.name} - ${s.title}"`,
                    )

                    const creationDate = new Date(
                        date.getTime() - millisecondsInADay * copyIndex,
                    )

                    console.log(`Uploading sermon audio file "${s.title}"`)

                    const fileBuffer = await readFile(
                        join(cwd(), "test", "audio", s.fileName),
                    )

                    const file = await tx.file.create({
                        data: {
                            name: s.fileName,
                            extension: "mp3",
                            mimeType: "audio/mpeg",
                            role: "SermonAudioFile",
                            uploadDateTime: creationDate,
                            FileContent: {
                                create: {
                                    content: fileBuffer,
                                },
                            },
                        },
                        include: {
                            FileContent: true,
                        },
                    })

                    const sermonSeries =
                        s.series === undefined
                            ? undefined
                            : ((await tx.sermonSeries.findFirst({
                                  where: {
                                      title: s.series.title,
                                  },
                              })) ?? undefined)

                    console.log(`Creating sermon "${s.title}"`)

                    await tx.sermon.create({
                        data: {
                            date: creationDate,
                            title: s.title,
                            audioFile: {
                                connect: {
                                    id: file.id,
                                },
                            },
                            speaker: {
                                connectOrCreate: {
                                    create: {
                                        initials: s.speaker.initials,
                                        name: s.speaker.name,
                                    },
                                    where: {
                                        initials: s.speaker.initials,
                                    },
                                },
                            },
                            series:
                                sermonSeries !== undefined
                                    ? {
                                          connect: {
                                              id: sermonSeries?.id,
                                          },
                                      }
                                    : s.series !== undefined
                                      ? {
                                            create: {
                                                title: s.series.title,
                                            },
                                        }
                                      : undefined,
                        },
                    })

                    console.log(`Finished creating sermon "${s.title}"`)
                },
                {
                    isolationLevel: "Serializable",
                    timeout: 10_000,
                },
            )
        }
    }
}

export async function setupTestEnv(reset?: boolean) {
    console.log("Setting up test database")

    if (reset) {
        await resetTables()
    }
    const dbClient = await getClient()

    await dbClient.databaseMetadata.create({
        data: {
            isDevData: true,
            version: databaseVersion,
        },
    })

    await setupTestEnvUsers()
    await setupTestEnvSermons()

    console.log("Finished")
}

export async function setupProdEnv(reset?: boolean) {
    console.log("Setting up production database")

    if (reset) {
        console.log(
            "###########################################################################\n" +
                "#### !!! PRODUCTION DATABASE IS ABOUT TO BE REPLACED IN 10 SECONDS !!! ####\n" +
                "####       !!! ALL DATA IN THE DATABASE WILL BE LOST FOREVER !!!       ####\n" +
                "###########################################################################",
        )

        await asyncSleep(10_000)

        await resetTables()
    }

    const dbClient = await getClient()

    await dbClient.databaseMetadata.create({
        data: {
            isDevData: false,
            version: databaseVersion,
        },
    })

    await setupProdEnvUsers()

    console.log("Finished")
}
