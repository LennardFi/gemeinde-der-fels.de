import { getRandomInt } from "@/lib/shared/helpers"
import { readFile, rm } from "fs/promises"
import { join } from "path"
import { cwd } from "process"
import { getPasswordHash } from "../src/lib/backend/auth"
import {
    databaseVersion,
    filesFolderPath,
    getClient,
    storeFileToFolder,
} from "../src/lib/backend/databaseHelpers"
import { sermons } from "./sermons"
import { users } from "./users"

export async function resetTables() {
    try {
        await getClient().responseLog.deleteMany()
        await getClient().errorLog.deleteMany()
        await getClient().newsPost.deleteMany()
        await getClient().sermon.deleteMany()
        await getClient().file.deleteMany()
        await getClient().sermonSeries.deleteMany()
        await getClient().sermonSpeaker.deleteMany()
        await getClient().user.deleteMany()
        await rm(filesFolderPath, {
            force: true,
            recursive: true,
        })
    } catch (e) {
        console.log("error while resetting", e)
        throw e
    }
}

export async function setupUsers() {
    await getClient().user.deleteMany()
    await getClient().$transaction(
        async (transaction) => {
            for await (const user of users) {
                console.log(`Uploading user "${user.name}"`)

                const passwordHash = await getPasswordHash(user.password)
                await transaction.user.create({
                    data: {
                        userName: user.name,
                        passwordHash,
                        email: `${user.name}@example.com`,
                        AdminFlag: user.flags.Admin,
                        ManageCalendarFlag: user.flags.ManageCalendar,
                        ManageNewsFlag: user.flags.ManageNews,
                        ManageRoomsFlag: user.flags.ManageRooms,
                        ManageSermonsFlag: user.flags.ManageSermons,
                        ManageUserFlag: user.flags.ManageUser,
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

const sermonCopies = 10

export async function setupSermons() {
    await getClient().$transaction(
        async (transaction) => {
            for await (const sermon of sermons) {
                const millisecondsInADay = 1000 * 60 * 60 * 24
                const date = new Date(
                    Date.now() -
                        millisecondsInADay * getRandomInt(365, 365 * 3),
                )
                for (let copyIndex = 0; copyIndex < sermonCopies; copyIndex++) {
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

                    const file = await transaction.file.create({
                        data: {
                            name: s.fileName,
                            extension: "mp3",
                            mimeType: "audio/mpeg",
                            role: "SermonAudioFile",
                            uploadDateTime: creationDate,
                        },
                    })

                    const fileBuffer = await readFile(
                        join(cwd(), "test", "audio", s.fileName),
                    )

                    try {
                        await storeFileToFolder(
                            file.fileId,
                            file.extension,
                            fileBuffer,
                        )
                    } catch (e) {
                        await transaction.file.delete({
                            where: {
                                id: file.id,
                            },
                        })
                        throw e
                    }

                    const sermonSeries =
                        s.series === undefined
                            ? undefined
                            : (await transaction.sermonSeries.findFirst({
                                  where: {
                                      title: s.series.title,
                                  },
                              })) ?? undefined

                    console.log(`Uploading sermon "${s.title}"`)

                    await transaction.sermon.create({
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

                    console.log(`Finished uploading sermon "${s.title}"`)
                }
            }
        },
        {
            isolationLevel: "Serializable",
            timeout: 20_000,
        },
    )
}

export async function setupTestEnv(reset?: boolean) {
    if (reset) {
        await resetTables()
    }

    await getClient().databaseMetadata.create({
        data: {
            isDevData: true,
            version: databaseVersion,
        },
    })

    await setupUsers()
    await setupSermons()

    console.log("Finished")
}

// setupTestEnv(true)
