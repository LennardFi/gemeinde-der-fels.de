import { asyncSleep } from "@/lib/shared/develop"
import { readRequiredEnvValueSafely } from "@/lib/shared/env"
import { WebsiteError } from "@/lib/shared/errors"
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

export async function setupTestEnvUsers() {
    await getClient().user.deleteMany()
    await getClient().$transaction(
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
    const adminUserName = "admin"

    const initialAdminEmail = readRequiredEnvValueSafely(
        "GDF_INITIAL_PRODUCTION_ADMIN_SET_EMAIL",
        "string",
    )
    if (initialAdminEmail === "") {
        throw new WebsiteError(
            "setup",
            `Environment variable "GDF_INITIAL_PRODUCTION_ADMIN_SET_EMAIL" contains empty string`,
        )
    }

    const initialAdminPassword = readRequiredEnvValueSafely(
        "GDF_INITIAL_PRODUCTION_ADMIN_SET_PASSWORD",
        "string",
    )
    if (initialAdminPassword === "") {
        throw new WebsiteError(
            "setup",
            `Environment variable "GDF_INITIAL_PRODUCTION_ADMIN_SET_PASSWORD" contains empty string`,
        )
    }

    console.log(`Creating user "${adminUserName}"`)

    await getClient().user.upsert({
        create: {
            email: initialAdminEmail,
            userName: adminUserName,
            passwordHash: await getPasswordHash(initialAdminPassword),
            resetRequired: true,
        },
        update: {},
        where: {
            userName: "admin",
        },
    })
}

const sermonCopies = 10

export async function setupTestEnvSermons() {
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
    console.log("Setting up test database")

    if (reset) {
        await resetTables()
    }

    await getClient().databaseMetadata.create({
        data: {
            isDevData: true,
            version: databaseVersion,
        },
    })

    await setupTestEnvUsers()
    await setupTestEnvSermons()

    console.log("Finished")
}

export async function setupProdEnv(
    reset?: boolean,
    really?: boolean,
    iMeanReally?: boolean,
) {
    console.log("Setting up production database")

    if (reset && really && iMeanReally) {
        console.log(
            "######################################################################\n" +
                "#### PRODUCTION DATABASE IS ABOUT TO BE DELETED IN 10 SECONDS !!! ####\n" +
                "######################################################################",
        )

        await asyncSleep(10_000)

        await resetTables()
    }

    await setupProdEnvUsers()

    console.log("Finished")
}
